import React from "react";
import { useForm, usePage } from "@inertiajs/react";
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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const { success } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post("/auth/login/post");
    };

    return (
        <AuthLayout>
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
                <div className="w-full max-w-md">
                    {/* Welcome Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <span className="text-5xl relative z-10">👋</span>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-slate-600">Masuk untuk melanjutkan produktivitas Anda</p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-lg border-slate-200">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-slate-800">Masuk</CardTitle>
                            <CardDescription className="text-slate-600">
                                Masukkan kredensial Anda untuk mengakses akun
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success && (
                                <div className="mb-6">
                                    <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                                        <CheckCircle2Icon className="w-5 h-5 text-emerald-600" />
                                        <AlertTitle className="font-semibold">Berhasil!</AlertTitle>
                                        <AlertDescription className="text-emerald-700">
                                            {success}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-slate-700 font-semibold">
                                            Email
                                        </FieldLabel>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="contoh@email.com"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                                className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                                            />
                                        </div>
                                        {errors.email && (
                                            <div className="text-sm text-red-600 mt-1 font-medium">
                                                {errors.email}
                                            </div>
                                        )}
                                    </Field>
                                    
                                    <Field>
                                        <FieldLabel htmlFor="password" className="text-slate-700 font-semibold">
                                            Kata Sandi
                                        </FieldLabel>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Masukkan kata sandi"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-200"
                                            />
                                        </div>
                                        {errors.password && (
                                            <div className="text-sm text-red-600 mt-1 font-medium">
                                                {errors.password}
                                            </div>
                                        )}
                                    </Field>
                                    
                                    <Field className="pt-2">
                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Memproses...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Masuk
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500">atau</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="text-center">
                                <p className="text-slate-600">
                                    Belum punya akun?{" "}
                                    <a
                                        href="/auth/register"
                                        className="text-blue-600 hover:text-cyan-600 font-semibold hover:underline transition-colors"
                                    >
                                        Daftar sekarang
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Text */}
                    <div className="text-center mt-6 text-sm text-slate-500">
                        Dengan masuk, Anda menyetujui syarat dan ketentuan kami
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
