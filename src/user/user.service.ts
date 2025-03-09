import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    private users = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
        { id: 3, name: '王五', email: 'wangwu@example.com' },
    ];

    getUsers() {
        return this.users;
    }
}