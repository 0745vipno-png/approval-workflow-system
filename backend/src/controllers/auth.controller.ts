import type { Request, Response } from "express";

type Role = "REQUESTER" | "MANAGER" | "HR" | "ADMIN";

interface DemoUser {
  id: number;
  name: string;
  email: string;
  account: string;
  password: string;
  roles: Role[];
}

const demoUsers: DemoUser[] = [
  {
    id: 1,
    name: "王小明",
    email: "requester@example.com",
    account: "requester",
    password: "1234",
    roles: ["REQUESTER"],
  },
  {
    id: 2,
    name: "陳主任",
    email: "manager@example.com",
    account: "manager",
    password: "1234",
    roles: ["MANAGER"],
  },
  {
    id: 3,
    name: "林小姐",
    email: "hr@example.com",
    account: "hr",
    password: "1234",
    roles: ["HR"],
  },
  {
    id: 4,
    name: "系統管理員",
    email: "admin@example.com",
    account: "admin",
    password: "1234",
    roles: ["ADMIN"],
  },
];

export async function login(req: Request, res: Response) {
  try {
    const { account, password } = req.body as {
      account?: string;
      password?: string;
    };

    if (!account || !password) {
      return res.status(400).json({
        message: "Account and password are required",
      });
    }

    const user = demoUsers.find(
      (item) => item.account === account && item.password === password
    );

    if (!user) {
      return res.status(401).json({
        message: "帳號或密碼錯誤",
      });
    }

    return res.status(200).json({
      message: "Login success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        token: `demo-token-${user.id}`,
      },
    });
  } catch (error) {
    console.error("login error:", error);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
}