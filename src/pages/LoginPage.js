import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { loginUsuario } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";
import ErrorMessage from "../components/common/ErrorMessage";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      senha: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("Email é obrigatório"),
      senha: Yup.string().min(1, "Senha deve ter no mínimo 1 caracteres").required("Senha é obrigatória"),
    }),
    onSubmit: async (values) => {
      try {
        const userData = await loginUsuario(values.email, values.senha);
        login(userData);
        navigate("/home");
      } catch (error) {
        setError({ message: "Falha ao fazer login", details: error.message });
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 dark:bg-gray-900 text-gray-100">
      <form
        className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={formik.handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <ErrorMessage message={error.message} details={error.details} />}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 mb-4">{formik.errors.email}</div>
        ) : null}

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200"
          {...formik.getFieldProps("senha")}
        />
        {formik.touched.senha && formik.errors.senha ? (
          <div className="text-red-500 mb-4">{formik.errors.senha}</div>
        ) : null}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
