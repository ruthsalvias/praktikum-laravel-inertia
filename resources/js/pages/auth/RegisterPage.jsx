import React from "react";
import AuthLayout from "@/layouts/AuthLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useForm } from "@inertiajs/react";

export default function RegisterPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post("/auth/register/post", {
            onSuccess: () => {
                reset("name", "email", "password");
            },
            onError: () => {
                reset("password");
            },
        });
    };

    return (
        <AuthLayout>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="w-full max-w-md px-4">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">👋</div>
                        <h1 className="text-3xl font-bold text-cyan-600 mb-2">
                            Selamat Datang
                        </h1>
                        <p className="text-gray-600">
                            Daftar untuk melanjutkan produktivitas Anda
                        </p>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Daftar</CardTitle>
                            <CardDescription>
                                Buat akun baru Anda untuk memulai
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Nama Lengkap
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Masukkan nama lengkap"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@email.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.email && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.email}
                                            </div>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="password">
                                            Kata Sandi
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Masukkan kata sandi"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.password && (
                                            <div className="text-sm text-red-600 mt-1">
                                                {errors.password}
                                            </div>
                                        )}
                                    </Field>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses..." : "Daftar →"}
                                    </Button>

                                    <div className="text-center text-sm text-gray-600">
                                        atau
                                    </div>

                                    <FieldDescription className="text-center text-sm">
                                        Sudah punya akun?{" "}
                                        <Link
                                            href="/auth/login"
                                            className="text-cyan-600 hover:underline font-medium"
                                        >
                                            Masuk sekarang
                                        </Link>
                                    </FieldDescription>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Dengan mendaftar, Anda menyetujui syarat dan ketentuan kami
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
