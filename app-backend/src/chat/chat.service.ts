import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument, messageType } from './entities/chat.entity';
import { UsersService } from 'src/users/users.service';
import { ObjectId } from 'mongodb';
import { ChatListService } from 'src/users/chatlist.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private chatModel: Model<ChatDocument>,
    private chatListService: ChatListService,

    private userService: UsersService,
  ) {}

  async create(msg: messageData): Promise<Chat> {
    const chat = new Chat();
    chat.chatId = new Types.ObjectId(msg.rooms as string);
    if (msg.type == messageType.text) {
      chat.message = msg.text;
    }
    if (msg.type == messageType.source) {
      chat.sourceId = msg.sourceId;
    }
    if (msg.type == messageType.quiz) {
      chat.quizId = msg.quizId;
    }
    const user: any = await this.userService.findByExactUsername(msg.sender);
    chat.msgType = msg.type;
    chat.userId = user._id;
    const createdChat = new this.chatModel(chat);
    const savedChat = await createdChat.save();
    await this.chatListService.updateChatList(chat.chatId, savedChat._id);
    return savedChat;
  }

  async findAll() {
    return this.chatModel.find().exec();
  }

  async findChatRoomByOffset(
    offset: number,
    chatId: ObjectId,
  ): Promise<Chat[] | null> {
    const size = 10;
    offset--;
    offset *= size;
    const messages = await this.chatModel
      .find({ chatId: chatId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(size)
      .populate('userId', 'username')
      .exec();
    const transformMessages = (messages) => {
      return messages.map((msg) => ({
        text: msg.message,
        sender: msg.userId.username,
        type: 'Text', // Assuming all messages are of type "Text"
        time: new Date(msg.createdAt).toLocaleTimeString().slice(0, 5), // Formats the time as HH:MM
      }));
    };
    const formattedMessages = transformMessages(messages);
    return formattedMessages;
  }
}

type messageData = {
  rooms: string;
  type: messageType;
  text?: string;
  sourceId?: ObjectId;
  quizId?: ObjectId;
  sender: string;
};
