/**
 * [INPUT]: email, verification code, source
 * [OUTPUT]: Supabase waitlist API client with email verification
 * [POS]: lib层 - 数据服务
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// 验证码存储（内存 + localStorage 降级）
const verificationCodes = new Map();

// 动态导入 Supabase 客户端（避免 SSR 问题）
async function getSupabase() {
  if (supabase) return supabase;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials not configured. Using localStorage fallback.");
    return null;
  }

  const { createClient } = await import("@supabase/supabase-js");
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

/**
 * 生成 6 位数字验证码
 */
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 发送验证码到邮箱
 * 注意：实际项目中应该调用后端 API 或 Supabase Edge Function 发送邮件
 * 这里提供模拟实现，方便前端测试
 * 
 * @param {string} email - 用户邮箱
 * @returns {Promise<{success: boolean, message: string, code?: string}>}
 */
export async function sendVerificationCode(email) {
  // 基础验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { success: false, message: "invalid_email" };
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  // 检查是否已在候补名单
  const client = await getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from("waitlist")
        .select("email")
        .eq("email", normalizedEmail)
        .single();
      
      if (data) {
        return { success: false, message: "already_joined" };
      }
    } catch (err) {
      console.warn("Check existing email error:", err);
    }
  } else {
    // localStorage 检查
    const existing = JSON.parse(localStorage.getItem("sendol_waitlist") || "[]");
    if (existing.some((item) => item.email === normalizedEmail)) {
      return { success: false, message: "already_joined" };
    }
  }

  // 生成验证码
  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 分钟过期

  // 存储验证码
  const codeData = {
    code,
    expiresAt,
    attempts: 0,
    verified: false,
  };
  
  verificationCodes.set(normalizedEmail, codeData);
  
  // 同时存储到 localStorage（用于降级和持久化）
  try {
    const storedCodes = JSON.parse(localStorage.getItem("sendol_verification_codes") || "{}");
    storedCodes[normalizedEmail] = codeData;
    localStorage.setItem("sendol_verification_codes", JSON.stringify(storedCodes));
  } catch (e) {
    console.warn("Failed to store verification code:", e);
  }

  // TODO: 实际项目中，这里应该调用后端 API 发送邮件
  // 例如：await fetch('/api/send-verification', { method: 'POST', body: JSON.stringify({ email, code }) })
  
  // 开发模式下在控制台输出验证码，方便测试
  if (import.meta.env.DEV) {
    console.log(`[DEV] Verification code for ${normalizedEmail}: ${code}`);
  }

  return { 
    success: true, 
    message: "code_sent",
    // 仅在开发环境返回验证码，生产环境应该通过邮件发送
    ...(import.meta.env.DEV && { code })
  };
}

/**
 * 验证验证码
 * @param {string} email - 用户邮箱
 * @param {string} inputCode - 用户输入的验证码
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function verifyCode(email, inputCode) {
  const normalizedEmail = email.toLowerCase().trim();
  
  // 从内存获取
  let codeData = verificationCodes.get(normalizedEmail);
  
  // 如果内存没有，尝试从 localStorage 恢复
  if (!codeData) {
    try {
      const storedCodes = JSON.parse(localStorage.getItem("sendol_verification_codes") || "{}");
      codeData = storedCodes[normalizedEmail];
    } catch (e) {
      console.warn("Failed to retrieve verification code:", e);
    }
  }

  if (!codeData) {
    return { success: false, message: "code_expired" };
  }

  // 检查是否已过期
  if (Date.now() > codeData.expiresAt) {
    verificationCodes.delete(normalizedEmail);
    return { success: false, message: "code_expired" };
  }

  // 检查尝试次数
  if (codeData.attempts >= 5) {
    verificationCodes.delete(normalizedEmail);
    return { success: false, message: "too_many_attempts" };
  }

  // 验证验证码
  if (codeData.code !== inputCode.trim()) {
    codeData.attempts += 1;
    return { success: false, message: "invalid_code" };
  }

  // 标记为已验证
  codeData.verified = true;
  verificationCodes.set(normalizedEmail, codeData);

  return { success: true, message: "verified" };
}

/**
 * 提交邮箱到候补名单（需要验证码）
 * @param {string} email - 用户邮箱
 * @param {string} code - 验证码
 * @param {string} source - 来源标识（如 'pro_card', 'hero'）
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function joinWaitlist(email, code, source = "landing") {
  const normalizedEmail = email.toLowerCase().trim();
  
  // 验证验证码
  const verifyResult = await verifyCode(email, code);
  if (!verifyResult.success) {
    return verifyResult;
  }

  const client = await getSupabase();

  // 如果没有配置 Supabase，使用 localStorage 作为降级方案
  if (!client) {
    return saveToLocalStorage(normalizedEmail, source);
  }

  try {
    const { error } = await client.from("waitlist").insert([
      {
        email: normalizedEmail,
        source,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "already_joined" };
      }
      throw error;
    }

    // 清理已使用的验证码
    verificationCodes.delete(normalizedEmail);
    try {
      const storedCodes = JSON.parse(localStorage.getItem("sendol_verification_codes") || "{}");
      delete storedCodes[normalizedEmail];
      localStorage.setItem("sendol_verification_codes", JSON.stringify(storedCodes));
    } catch (e) {
      console.warn("Failed to clean up verification code:", e);
    }

    return { success: true, message: "success" };
  } catch (err) {
    console.error("Waitlist submission error:", err);
    // 失败后降级到 localStorage
    return saveToLocalStorage(normalizedEmail, source);
  }
}

/**
 * localStorage 降级存储
 */
function saveToLocalStorage(email, source) {
  try {
    const key = "sendol_waitlist";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");

    // 检查是否已存在
    if (existing.some((item) => item.email === email)) {
      return { success: false, message: "already_joined" };
    }

    existing.push({
      email: email,
      source,
      created_at: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(existing));
    return { success: true, message: "success_local" };
  } catch (err) {
    console.error("LocalStorage save error:", err);
    return { success: false, message: "error" };
  }
}

/**
 * 获取候补名单数量（用于显示已加入人数）
 * @returns {Promise<number>}
 */
export async function getWaitlistCount() {
  const client = await getSupabase();

  if (!client) {
    // 从 localStorage 获取
    try {
      const existing = JSON.parse(localStorage.getItem("sendol_waitlist") || "[]");
      return existing.length;
    } catch {
      return 0;
    }
  }

  try {
    const { count, error } = await client
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("Failed to get waitlist count:", err);
    return 0;
  }
}

/**
 * 重新发送验证码
 * @param {string} email - 用户邮箱
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function resendVerificationCode(email) {
  // 删除旧验证码
  const normalizedEmail = email.toLowerCase().trim();
  verificationCodes.delete(normalizedEmail);
  
  // 重新发送
  return sendVerificationCode(email);
}
