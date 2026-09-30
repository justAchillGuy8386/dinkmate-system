'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { MobileOutlined, LockOutlined } from '@ant-design/icons';
import { UserItem } from './types';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserItem, token: string) => void;
}

export default function LoginModal({ open, onClose, onLoginSuccess }: LoginModalProps) {
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

      form.resetFields();
      onLoginSuccess(data.data, data.token);
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
    <Modal
      open={open}
      onCancel={() => {
        setErrorMessage(null);
        onClose();
      }}
      footer={null}
      width={400}
      centered
      styles={{
        body: {
          padding: 28,
        },
      }}
    >
      <div className="text-center mb-6">
        <div className="text-xs font-semibold tracking-widest text-[#86868B] uppercase mb-1.5">
          Tài khoản DinkMate
        </div>
        <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight mb-2">
          Đăng Nhập
        </h3>
        <p className="text-xs text-[#86868B] leading-relaxed">
          Nhập số điện thoại và mật khẩu để quản lý thông tin và theo dõi thành tích thi đấu.
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
              backgroundColor: '#059669',
              borderColor: '#059669',
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
          className="text-[#059669] hover:underline font-medium cursor-pointer"
        >
          Dùng tài khoản mẫu
        </button>
      </div>
    </Modal>
  );
}
