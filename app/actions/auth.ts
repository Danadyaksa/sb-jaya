"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau kata sandi salah. Silakan coba lagi." };
  }

  // Get user role
  let role = "customer";
  if (data.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role) {
      role = profile.role;
    } else if (data.user.user_metadata?.role) {
      role = data.user.user_metadata.role;
    }
  }

  revalidatePath("/", "layout");

  if (role === "kasir") {
    redirect("/admin/products");
  } else if (role === "gudang") {
    redirect("/admin/stock");
  } else {
    redirect("/");
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirmation = formData.get("password_confirmation") as string;

  if (!name || !email || !password) {
    return { error: "Semua kolom wajib diisi." };
  }

  if (password !== passwordConfirmation) {
    return { error: "Konfirmasi kata sandi tidak cocok." };
  }

  if (password.length < 6) {
    return { error: "Kata sandi minimal 6 karakter." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: "customer",
      },
    },
  });

  if (error) {
    return { error: error.message || "Gagal mendaftar. Silakan coba lagi." };
  }

  if (data.user) {
    // Insert into profiles table
    await supabase.from("profiles").upsert({
      id: data.user.id,
      name,
      role: "customer",
    });
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
