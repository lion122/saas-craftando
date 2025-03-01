"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Dados pessoais, 2: Dados da loja
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [storeData, setStoreData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Se estiver alterando o slug, remova espaços, caracteres especiais e converta para minúsculas
    if (name === "slug") {
      const formattedSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setStoreData((prev) => ({ ...prev, [name]: formattedSlug }));
    } else {
      setStoreData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep1 = () => {
    if (!userData.name.trim()) {
      toast.error("O nome é obrigatório");
      return false;
    }
    if (!userData.email.trim() || !userData.email.includes("@")) {
      toast.error("Email inválido");
      return false;
    }
    if (userData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (userData.password !== userData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!storeData.name.trim()) {
      toast.error("O nome da loja é obrigatório");
      return false;
    }
    if (!storeData.slug.trim()) {
      toast.error("O slug da loja é obrigatório");
      return false;
    }
    return true;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // 1. Registrar o usuário
      const userResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const userData2 = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userData2.message || "Falha ao registrar usuário");
      }

      // 2. Fazer login para obter o token
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.message || "Falha ao autenticar");
      }

      // Salvar token
      localStorage.setItem("token", loginData.access_token);
      localStorage.setItem("refreshToken", loginData.refresh_token);

      // 3. Criar a loja com o token de autenticação
      const storeResponse = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginData.access_token}`,
        },
        body: JSON.stringify(storeData),
      });

      const storeResponseData = await storeResponse.json();

      if (!storeResponse.ok) {
        throw new Error(storeResponseData.message || "Falha ao criar loja");
      }

      toast.success("Cadastro realizado com sucesso!");
      router.push(`/admin/lojas/${storeResponseData.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha no cadastro");
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShoppingBag className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {step === 1 ? "Crie sua conta" : "Configure sua loja"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 ? (
            <>
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Faça login
              </Link>
            </>
          ) : (
            <>
              Etapa 2 de 2 - Configure sua loja virtual
            </>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleContinue}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Nome completo
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={userData.name}
                    onChange={handleUserChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={userData.email}
                    onChange={handleUserChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={userData.password}
                    onChange={handleUserChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirme a senha
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={userData.confirmPassword}
                    onChange={handleUserChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Continuar
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium leading-6 text-gray-900">
                  Nome da loja
                </label>
                <div className="mt-2">
                  <input
                    id="storeName"
                    name="name"
                    type="text"
                    required
                    value={storeData.name}
                    onChange={handleStoreChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="storeSlug" className="block text-sm font-medium leading-6 text-gray-900">
                  Slug da loja (URL)
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                      loja.com/
                    </span>
                    <input
                      id="storeSlug"
                      name="slug"
                      type="text"
                      required
                      value={storeData.slug}
                      onChange={handleStoreChange}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                      placeholder="minha-loja"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Apenas letras minúsculas, números e hífens. Sem espaços ou caracteres especiais.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="storeDescription" className="block text-sm font-medium leading-6 text-gray-900">
                  Descrição da loja (opcional)
                </label>
                <div className="mt-2">
                  <textarea
                    id="storeDescription"
                    name="description"
                    rows={3}
                    value={storeData.description}
                    onChange={handleStoreChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  />
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Cadastrando..." : "Finalizar cadastro"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 