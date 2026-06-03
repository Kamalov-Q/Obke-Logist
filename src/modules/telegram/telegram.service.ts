import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telegraf, Context, Markup } from 'telegraf';
import { TelegramUser } from './entities/telegram-user.entity';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ToursService } from '../tours/tours.service';

@Injectable()
export class TelegramService implements OnModuleInit {
    private readonly logger = new Logger(TelegramService.name);
    private bot: Telegraf;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(TelegramUser)
        private readonly telegramUserRepo: Repository<TelegramUser>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
        private readonly toursService: ToursService,
    ) {
        const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
        if (token) {
            this.bot = new Telegraf(token);
            this.setupBot();
        } else {
            this.logger.warn('TELEGRAM_BOT_TOKEN is not set. Telegram bot will not start.');
        }
    }

    onModuleInit() {
        if (this.bot) {
            this.bot.launch().catch(err => {
                this.logger.error(`Failed to launch Telegram bot: ${err.message}`);
            });
        }
    }

    private setupBot() {
        this.bot.start(async (ctx) => {
            const userId = ctx.from.id.toString();
            let user = await this.telegramUserRepo.findOne({ where: { telegramId: userId } });

            if (!user) {
                user = this.telegramUserRepo.create({
                    telegramId: userId,
                    username: ctx.from.username || null,
                    firstName: ctx.from.first_name,
                    lastName: ctx.from.last_name || null,
                });
                await this.telegramUserRepo.save(user);
            }

            if (user.phoneNumber) {
                await ctx.reply(
                    `✅ Siz allaqachon ro'yxatdan o'tgansiz!\n\n👤 ${user.tempFullName || `${user.firstName} ${user.lastName || ''}`.trim()}\n📞 +${user.phoneNumber}`,
                );
                return;
            }

            await ctx.reply(
                `👋 Assalomu alaykum, ${ctx.from.first_name || 'foydalanuvchi'}!\n\n` +
                `<b>Tourland</b> yordamchi botimizga xush kelibsiz! 😊\n\n` +
                `Ro'yxatdan o'tish uchun, iltimos, <b>Ism va Familiyangizni</b> kiriting (Masalan: Eshmat Toshmatov):`,
                { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } }
            );
        });

        this.bot.on('contact', async (ctx) => {
            const contact = ctx.message.contact;
            const userId = ctx.from.id.toString();
            const user = await this.telegramUserRepo.findOne({ where: { telegramId: userId } });

            if (user) {
                user.phoneNumber = contact.phone_number.replace('+', '');
                // phoneNumber is prioritized now
                await this.telegramUserRepo.save(user);

                await ctx.reply(
                    `✅ <b>Muvaffaqiyatli ro'yxatdan o'tdingiz!</b>\n\n` +
                    `👤 ${user.tempFullName || `${user.firstName} ${user.lastName || ''}`.trim()}\n` +
                    `📞 +${user.phoneNumber}\n\n` +
                    `Endi siz tizimdan to'liq foydalana olasiz!`,
                    { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } },
                );

                this.linkWithEmployee(user);
            }
        });

        this.bot.on('text', async (ctx) => {
            const userId = ctx.from.id.toString();
            const user = await this.telegramUserRepo.findOne({ where: { telegramId: userId } });
            const text = ctx.message.text;

            if (user && !user.tempFullName && text && !text.startsWith('/')) {
                user.tempFullName = text.trim();
                await this.telegramUserRepo.save(user);

                await ctx.reply(
                    `Rahmat, <b>${user.tempFullName}</b>! 😊\n\n` +
                    `Endi oxirgi qadam: pastdagi tugmani bosib <b>telefon raqamingizni</b> yuboring.\n\n` +
                    `⚠️ <b>DIQQAT:</b> Tizimda sizni aniqlashimiz uchun aynan o'zingiz foydalanayotgan raqamni yuborishingiz shart.`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            keyboard: [[{ text: '📱 Telefon raqamni yuborish', request_contact: true }]],
                            one_time_keyboard: true,
                            resize_keyboard: true,
                        },
                    }
                );
            } else if (user && user.tempFullName && !user.phoneNumber) {
                // User already sent name but not contact
                await ctx.reply(
                    `⚠️ <b>${user.tempFullName}</b>, iltimos, pastdagi tugma orqali telefon raqamingizni yuboring:`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            keyboard: [[{ text: '📱 Telefon raqamni yuborish', request_contact: true }]],
                            one_time_keyboard: true,
                            resize_keyboard: true,
                        },
                    }
                );
            } else if (user && user.phoneNumber) {
                await ctx.reply(`✅ Siz allaqachon ro'yxatdan o'tgansiz!`);
            }
        });

        this.bot.command('help', async (ctx) => {
            await ctx.reply(
                `<b>Mavjud buyruqlar:</b>\n\n` +
                `/start - Ro'yxatdan o'tish\n` +
                `/news - Yangi turlar va paketlar\n` +
                `/history - Xabarlar tarixi\n` +
                `/contact - Biz bilan bog'lanish\n` +
                `/help - Buyruqlar ro'yxati`,
                { parse_mode: 'HTML' }
            );
        });

        this.bot.command('contact', async (ctx) => {
            await ctx.reply(
                `<b>Biz bilan bog'lanish:</b>\n\n` +
                `📍 <b>Manzil:</b> Toshkent sh., ...\n` +
                `📞 <b>Telefon:</b> +998...\n` +
                `🌐 <b>Sayt:</b> <a href="https://tourland.uz">tourland.uz</a>`,
                { parse_mode: 'HTML', link_preview_options: { is_disabled: true } }
            );
        });

        this.bot.command('news', async (ctx) => {
            try {
                const tours = await this.toursService.findAll();
                if (!tours || tours.length === 0) {
                    await ctx.reply(`Hozircha yangi turlar mavjud emas.`);
                    return;
                }

                let message = `<b>🔥 So'nggi tur paketlar:</b>\n\n`;
                for (const tour of tours.slice(0, 5)) {
                    message += `📍 <b>${tour.nameUz}</b>\n`;
                    if (tour.link) message += `🔗 <a href="${tour.link}">Batafsil</a>\n`;
                    message += `-------------------\n`;
                }
                
                await ctx.reply(message, { parse_mode: 'HTML', link_preview_options: { is_disabled: true } });
            } catch (err) {
                this.logger.error(`Failed to handle /news: ${err.message}`);
                await ctx.reply(`Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.`);
            }
        });

        this.bot.command('history', async (ctx) => {
            const userId = ctx.from.id.toString();
            const tUser = await this.telegramUserRepo.findOne({ where: { telegramId: userId } });

            if (!tUser || !tUser.phoneNumber) {
                await ctx.reply(`⚠️ Xabarlar tarixini ko'rish uchun avval ro'yxatdan o'ting: /start`);
                return;
            }

            try {
                // Try to find if this is an employee
                const employee = await this.userRepo.findOne({ where: { telegramId: userId } });
                
                if (employee) {
                    const notifications = await this.notificationRepo.find({
                        where: { userId: employee.id },
                        order: { createdAt: 'DESC' },
                        take: 10
                    });

                    if (notifications.length === 0) {
                        await ctx.reply(`Sizda xabarlar mavjud emas.`);
                        return;
                    }

                    let message = `<b>🔔 Oxirgi xabarlaringiz:</b>\n\n`;
                    for (const n of notifications) {
                        const date = n.createdAt.toLocaleDateString('uz-UZ');
                        message += `📅 ${date}\n📩 ${n.message}\n\n`;
                    }
                    await ctx.reply(message, { parse_mode: 'HTML' });
                } else {
                    await ctx.reply(`Sizning xabarlar tarixingiz hozircha bo'sh.`);
                }
            } catch (err) {
                this.logger.error(`Failed to handle /history: ${err.message}`);
                await ctx.reply(`Xatolik yuz berdi.`);
            }
        });
    }

    private async linkWithEmployee(telegramUser: TelegramUser) {
        if (!telegramUser.phoneNumber) return;

        const employee = await this.userRepo.findOne({ 
            where: { phoneNumber: telegramUser.phoneNumber } 
        });

        if (employee) {
            this.logger.log(`Linking Telegram user ${telegramUser.telegramId} with CRM employee ${employee.id}`);
            employee.telegramId = telegramUser.telegramId;
            await this.userRepo.save(employee);
        }
    }

    async findAll() {
        return this.telegramUserRepo.find({ order: { createdAt: 'DESC' } });
    }

    async sendMessage(telegramIds: string[], text: string) {
        for (const id of telegramIds) {
            try {
                await this.bot.telegram.sendMessage(id, text, { parse_mode: 'HTML' });
            } catch (err) {
                this.logger.error(`Failed to send message to ${id}: ${err.message}`);
            }
        }
    }

    async sendToEmployee(phoneNumber: string, text: string) {
        // First try to find by already linked telegramId in User repo
        const employee = await this.userRepo.findOne({ where: { phoneNumber: phoneNumber.replace('+', '') } });
        
        if (employee && employee.telegramId) {
            await this.sendMessage([employee.telegramId], text);
            return;
        }

        // Fallback to searching in TelegramUser repo
        const tUser = await this.telegramUserRepo.findOne({ where: { phoneNumber: phoneNumber.replace('+', '') } });
        if (tUser) {
            await this.sendMessage([tUser.telegramId], text);
        }
    }

    async sendClientMessage(clientId: string, telegramId: string, text: string) {
        // 1. Send the message
        await this.sendMessage([telegramId], text);

        // 2. Link the client if not already linked
        const client = await this.clientRepo.findOne({ where: { id: clientId } });
        if (client) {
            client.telegramId = telegramId;
            await this.clientRepo.save(client);
        }
    }
}
