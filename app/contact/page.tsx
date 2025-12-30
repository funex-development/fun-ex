"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import Link from "next/link";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_CF_SITE_KEY || "";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    privacyPolicy: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef<string | null>(null);

  // Turnstileスクリプトが読み込まれた後に呼ばれる
  const handleTurnstileLoad = () => {
    if (typeof window !== "undefined" && (window as any).turnstile) {
      try {
        console.log("Turnstile site key:", TURNSTILE_SITE_KEY);
        (window as any).turnstile.render("#turnstile-widget", {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            turnstileRef.current = token;
          },
        });
      } catch (error) {
        console.error("Turnstile initialization error:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (!turnstileRef.current) {
      setStatus("error");
      setErrorMessage("ボット検証が完了していません。もう一度お試しください。");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken: turnstileRef.current,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "送信に失敗しました");
      }

      setStatus("success");
      setFormData({ company: "", name: "", email: "", phone: "", message: "", privacyPolicy: false });
      turnstileRef.current = null;

      // Turnstileをリセット
      if ((window as any).turnstile) {
        (window as any).turnstile.reset();
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "送信に失敗しました。もう一度お試しください。"
      );
    }
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        onLoad={handleTurnstileLoad}
        strategy="afterInteractive"
      />

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Outfit:wght@400;700&display=swap" rel="stylesheet" />

      {/* 既存CSSを読み込み */}
      <link rel="stylesheet" href="/style.css" />
      <link rel="stylesheet" href="/mvv.css" />
      <link rel="stylesheet" href="/subpage.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact</h1>
          <p className="page-subtitle">お問い合わせ</p>
        </div>
      </section>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <a href="/" className="logo">
            <img src="/assets/logo.png" alt="FunEx 株式会社ファンエクス" className="logo-img" width="200" height="90" />
          </a>
          <div className="nav-links">
            <a href="/index.html">TOP</a>
            <a href="about.html">会社概要</a>
            <a href="services.html">事業内容</a>
            <a href="news.html">ニュース</a>
            <a href="/contact" className="btn btn-primary">お問い合わせ</a>
          </div>
          <div className="mobile-menu-btn" id="mobile-menu-btn" aria-label="メニューを開く" role="button" tabIndex={0}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="mobile-menu" id="mobile-menu">
          <a href="/index.html" className="mobile-link">TOP</a>
          <a href="about.html" className="mobile-link">会社概要</a>
          <a href="services.html" className="mobile-link">事業内容</a>
          <a href="news.html" className="mobile-link">ニュース</a>
          <a href="/contact" className="mobile-link btn btn-primary">お問い合わせ</a>
        </div>
      </nav>

      {/* Contact Form Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="contact-card" style={{ display: 'block', padding: '60px 40px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--text-main)', textAlign: 'center' }}>
              お問い合わせフォーム
            </h2>
            <p style={{ marginBottom: '40px', color: 'var(--text-muted)', lineHeight: '1.8', textAlign: 'center' }}>
              制作のご相談、ご依頼など、お気軽にお問合せください。<br />
              担当者よりご連絡させていただきます。
            </p>

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
              {/* 会社名 */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="company" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  会社名 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="株式会社〇〇"
                />
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  ※個人の方は「なし」とご記入ください
                </p>
              </div>

              {/* 氏名 */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  氏名 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="山田 太郎"
                />
              </div>

              {/* メールアドレス */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  メールアドレス <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="example@example.com"
                />
              </div>

              {/* 電話番号（任意） */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  電話番号
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                  }}
                  placeholder="03-1234-5678"
                />
              </div>

              {/* お問い合わせ内容 */}
              <div style={{ marginBottom: '24px' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  お問い合わせ内容 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical',
                  }}
                  placeholder="お問い合わせ内容をご記入ください"
                />
              </div>

              {/* プライバシーポリシー */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.privacyPolicy}
                    onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.checked })}
                    required
                    style={{ marginTop: '4px', marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <a href="/privacy.html" target="_blank" style={{ color: '#0066cc', textDecoration: 'underline' }}>プライバシーポリシー</a>に同意する <span style={{ color: '#ef4444' }}>*</span>
                  </span>
                </label>
              </div>

              {/* Cloudflare Turnstile */}
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                <div id="turnstile-widget"></div>
              </div>

              {/* ステータスメッセージ */}
              {status === "success" && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #86efac',
                  color: '#166534',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}>
                  送信が完了しました。担当者より折り返しご連絡いたします。
                </div>
              )}

              {status === "error" && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn btn-primary btn-large"
                style={{ width: '100%' }}
              >
                {status === "loading" ? "送信中..." : "送信する"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/">
              <img loading="lazy" src="/assets/logo.png" alt="FunEx 株式会社ファンエクス" className="footer-logo" width="120" height="50" />
            </a>
            <p>
              株式会社ファンエクス<br />
              〒101-0024<br />
              東京都千代田区神田和泉町1番地6-16ヤマトビル405
            </p>
          </div>
          <div className="footer-nav">
            <h4>Menu</h4>
            <ul>
              <li><a href="/">TOP</a></li>
              <li><a href="/about.html">会社概要</a></li>
              <li><a href="/services.html">事業内容</a></li>
              <li><a href="/news.html">最新情報</a></li>
              <li><a href="/contact">お問い合わせ</a></li>
            </ul>
          </div>
          <div className="footer-services">
            <h4>Services</h4>
            <ul>
              <li><a href="/services.html#service-game">ゲーム制作／メタバース</a></li>
              <li><a href="/services.html#service-event">オフラインイベント</a></li>
              <li><a href="/services.html#service-web">Web制作</a></li>
              <li><a href="/services.html#service-sns">SNSサポート</a></li>
              <li><a href="/services.html#service-ai">生成AI活用サポート</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          &copy; 2025 FunEx Inc. All Rights Reserved.
        </div>
      </footer>

      {/* Mobile menu and scroll script */}
      <Script id="mobile-menu" strategy="afterInteractive">
        {`
          const mobileMenuBtn = document.getElementById('mobile-menu-btn');
          const mobileMenu = document.getElementById('mobile-menu');

          if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
              mobileMenu.classList.toggle('active');
              mobileMenuBtn.classList.toggle('active');
            });
          }

          // Header Scroll Effect - Hide on scroll down, show on scroll up
          const navbar = document.querySelector('.navbar');
          let lastScrollTop = 0;

          window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Hide navbar when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop && scrollTop > 100) {
              // Scrolling down
              navbar.style.transform = 'translateY(-100%)';
              navbar.style.transition = 'transform 0.3s ease-in-out';
            } else {
              // Scrolling up or at top
              navbar.style.transform = 'translateY(0)';
              navbar.style.transition = 'transform 0.3s ease-in-out';
            }

            // Update scroll position
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            // Background effect
            if (window.scrollY > 50) {
              navbar.style.background = 'rgba(15, 23, 42, 0.95)';
              navbar.style.padding = '5px 0';
              navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            } else {
              navbar.style.background = 'rgba(15, 23, 42, 0.8)';
              navbar.style.padding = '8px 0';
              navbar.style.boxShadow = 'none';
            }
          });
        `}
      </Script>
    </>
  );
}
