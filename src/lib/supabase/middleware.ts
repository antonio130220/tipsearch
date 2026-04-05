import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = 
    request.nextUrl.pathname.startsWith("/login") || 
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/pending-approval") ||
    request.nextUrl.pathname.startsWith("/auth");

  // 1. Se NÃO houver utilizador e tentar aceder a uma página protegida -> Login
  if (!user && !isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Se HOUVER utilizador, verificar perfil e aprovação
  if (user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('aprovado, papel')
      .eq('id', user.id)
      .single();

    // Se o utilizador não existir na tabela 'users' e não estiver numa página de auth
    if ((userError || !userData) && !isAuthPage) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Se NÃO estiver aprovado e NÃO estiver na página de pendente -> Redirecionar para pendente
    if (userData && !userData.aprovado && request.nextUrl.pathname !== "/pending-approval") {
      const url = request.nextUrl.clone();
      url.pathname = "/pending-approval";
      return NextResponse.redirect(url);
    }

    // PROTEÇÃO DA ROTA ADMIN: Apenas papel 'admin' pode aceder
    if (request.nextUrl.pathname.startsWith("/admin") && userData?.papel !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redireciona para a home se não for admin
      return NextResponse.redirect(url);
    }

    // Se ESTIVER aprovado e tentar ir para login/register/pending -> Redirecionar para a Home
    if (userData?.aprovado && isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
