import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/database';
import nodemailer from 'nodemailer';
import { generateVerificationCode } from '@/src/lib/passwordUtils';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "No email provided" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prismaClient.user.findFirst({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "A user already exists with this email" },
                { status: 409 }
            );
        }

        // Generate verification code
        const code = generateVerificationCode();
        const expireAt = new Date(Date.now() + (1000 * 60 * 10)); // 10 minutes

        // Check if verification email already exists
        const existingVerification = await prismaClient.verificationEmail.findFirst({
            where: { email }
        });

        if (existingVerification) {
            await prismaClient.verificationEmail.update({
                where: { id: existingVerification.id },
                data: {
                    code,
                    expireAt
                }
            });
        } else {
            await prismaClient.verificationEmail.create({
                data: {
                    email,
                    code,
                    expireAt
                }
            });
        }
    // Removed debug log: EMAIL_PASS exposure prevention
        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'v1codesender@gmail.com',
                pass: process.env.EMAIL_PASS || 'welc dhux joam nyjw',  
            },
            logger: true,
            debug: true,
        });

        await transporter.sendMail({
            from: '"DreamHome" <v1codesender@gmail.com>',
            to: email,
            subject: 'Verification code for DreamHome',
            text: `Your verification code for signup is ${code}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to DreamHome!</h2>
                    <p>Your verification code is:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #007bff; padding: 20px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
                        ${code}
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `
        });

        return NextResponse.json(
            { message: "Verification code sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error sending verification code:", error);
        return NextResponse.json(
            { message: "Internal server error", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
