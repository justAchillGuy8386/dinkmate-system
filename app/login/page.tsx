'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfigProvider, Form, Input, Button, Alert, message } from 'antd';
import { MobileOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: { phone: string; password: string }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: values.phone.trim(),
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Đăng nhập không thành công');
        return;
      }

      localStorage.setItem('dinkmate_token', data.token);
      localStorage.setItem('dinkmate_user', JSON.stringify(data.data));

      message.success(`Đăng nhập thành công! Xin chào ${data.data.full_name}`);
      router.push('/');
    } catch {
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    form.setFieldsValue({
      phone: '0912345678',
      password: '123456',
    });
    setErrorMessage(null);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          borderRadius: 6,
          colorPrimary: '#0071E3',
          colorText: '#1D1D1F',
          colorTextSecondary: '#86868B',
          colorBorder: '#E5E5E7',
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#F5F5F7',
          boxShadow: 'none',
        },
        components: {
          Button: {
            borderRadius: 6,
            boxShadow: 'none',
          },
          Input: {
            borderRadius: 6,
          },
        },
      }}
    >
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            <ArrowLeftOutlined /> Quay lại DinkMate Portal
          </Link>
        </div>

        <div className="w-full max-w-sm bg-white border border-[#E5E5E7] rounded-[6px] p-8">
          <div className="text-center mb-6">
            <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-1.5">
              Tài khoản DinkMate
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-2">
              Đăng Nhập
            </h1>
            <p className="text-xs text-[#86868B] leading-relaxed">
              Nhập số điện thoại và mật khẩu để truy cập tài khoản hội viên.
            </p>
          </div>

          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              showIcon
              style={{
                marginBottom: 20,
                borderRadius: 6,
                fontSize: 12,
                border: '1px solid #FFA39E',
              }}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Form.Item
              label={<span className="text-xs font-semibold text-[#1D1D1F]">Số điện thoại</span>}
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ' },
              ]}
            >
              <Input
                prefix={<MobileOutlined style={{ color: '#86868B' }} />}
                placeholder="Ví dụ: 0912345678"
                style={{
                  height: 44,
                  borderRadius: 6,
                  borderColor: '#E5E5E7',
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-xs font-semibold text-[#1D1D1F]">Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#86868B' }} />}
                placeholder="Nhập mật khẩu"
                style={{
                  height: 44,
                  borderRadius: 6,
                  borderColor: '#E5E5E7',
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12, marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 6,
                  backgroundColor: '#1D1D1F',
                  borderColor: '#1D1D1F',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-4 pt-4 border-t border-[#E5E5E7] flex items-center justify-between text-xs text-[#86868B]">
            <span>Chưa có tài khoản?</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[#0071E3] hover:underline font-medium cursor-pointer"
            >
              Dùng tài khoản mẫu
            </button>
          </div>
        </div>

        <div className="mt-8 text-xs text-[#86868B] text-center">
          DinkMate Pickleball Platform · Bản quyền © 2026
        </div>
      </div>
    </ConfigProvider>
  );
}
