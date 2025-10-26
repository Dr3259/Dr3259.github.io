'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function TypeScriptPage() {
  const sections = [
    {
      title: '1. 基础类型系统',
      category: '类型系统',
      what: 'TypeScript 的基本类型定义，包括 string、number、boolean、null、undefined、symbol、bigint 等',
      why: '静态类型检查可以在编译期发现类型错误，避免运行时崩溃',
      how: 'let name: string = "Alice"; let age: number = 25;',
      sugar: '类型注解是对 JS 的增强，编译后会被移除',
      scenarios: ['变量声明', '函数参数', '函数返回值', 'API 接口定义'],
      relations: ['是所有类型系统的基础', '与类型推断配合使用'],
      code: `// 基本类型
let name: string = "Alice";
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// 数组类型
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// 元组类型
let tuple: [string, number] = ["Alice", 25];

// 枚举类型
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red;`,
    },
    {
      title: '2. any / unknown / never / void',
      category: '类型系统',
      what: '特殊类型：any 禁用检查、unknown 安全未知、never 永不返回、void 无返回值',
      why: 'any 会破坏类型安全，unknown 是更安全的替代品',
      how: 'let data: unknown = fetchData(); function error(): never { throw new Error(); }',
      sugar: 'unknown 是 any 的安全版本',
      scenarios: ['处理未知数据', '错误处理函数', '无返回值函数'],
      relations: ['unknown 需要类型守卫才能使用', 'never 用于穷尽检查'],
      code: `// any - 禁用类型检查（不推荐）
let anything: any = "hello";
anything = 123;
anything.foo.bar; // 不会报错

// unknown - 安全的未知类型
let value: unknown = "hello";
// value.toUpperCase(); // 报错
if (typeof value === "string") {
  value.toUpperCase(); // 正确
}

// void - 无返回值
function log(msg: string): void {
  console.log(msg);
}

// never - 永不返回
function error(msg: string): never {
  throw new Error(msg);
}`,
    },
    {
      title: '3. 联合类型与交叉类型',
      category: '类型系统',
      what: '联合类型（|）表示多选一，交叉类型（&）表示合并',
      why: '提供灵活的类型组合能力',
      how: 'type Status = "on" | "off"; type User = Person & Contact;',
      sugar: '类型级别的逻辑运算',
      scenarios: ['状态枚举', '类型合并', '函数重载替代'],
      relations: ['与类型守卫配合', '与泛型约束结合'],
      code: `// 联合类型
type Status = "on" | "off" | "pending";
let status: Status = "on";

type ID = string | number;
function printId(id: ID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// 交叉类型
type Person = { name: string };
type Contact = { email: string };
type User = Person & Contact;

const user: User = {
  name: "Alice",
  email: "alice@example.com"
};`,
    },
    {
      title: '4. 字面量类型',
      category: '类型系统',
      what: '使用具体的值作为类型，如 "on" | "off"',
      why: '提供更精确的类型约束',
      how: 'type Direction = "left" | "right" | "up" | "down";',
      sugar: '精确值约束',
      scenarios: ['配置选项', '状态机', 'API 参数'],
      relations: ['与联合类型结合', '与 const 断言配合'],
      code: `// 字符串字面量
type Direction = "left" | "right" | "up" | "down";
function move(direction: Direction) {
  console.log(\`Moving \${direction}\`);
}

// 数字字面量
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceValue = 3;

// 布尔字面量
type Success = true;
let result: Success = true;

// const 断言
const config = {
  host: "localhost",
  port: 8080
} as const; // 所有属性变为字面量类型`,
    },
    {
      title: '5. 接口（Interface）',
      category: '对象与接口',
      what: '描述对象结构的契约',
      why: '定义对象的形状，支持继承和扩展',
      how: 'interface User { name: string; age?: number; }',
      sugar: '对象结构的声明式定义',
      scenarios: ['API 响应', 'React Props', '数据模型'],
      relations: ['可以被类实现', '可以继承其他接口'],
      code: `// 基础接口
interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: string; // 只读属性
}

// 接口继承
interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// 索引签名
interface Dictionary {
  [key: string]: number;
}

// 函数接口
interface Add {
  (a: number, b: number): number;
}`,
    },
    {
      title: '6. 类型别名（Type Alias）',
      category: '对象与接口',
      what: '使用 type 关键字定义类型',
      why: '比 interface 更灵活，支持联合类型、条件类型等',
      how: 'type Point = { x: number; y: number };',
      sugar: '类型的命名引用',
      scenarios: ['联合类型', '函数类型', '工具类型'],
      relations: ['与 interface 类似但更灵活', '不支持声明合并'],
      code: `// 对象类型
type Point = {
  x: number;
  y: number;
};

// 联合类型
type Result = Success | Error;

// 函数类型
type Add = (a: number, b: number) => number;

// 交叉类型
type UserWithContact = User & Contact;

// 元组类型
type Pair = [string, number];

// 类型别名可以引用自己（递归）
type Tree = {
  value: number;
  left?: Tree;
  right?: Tree;
};`,
    },
    {
      title: '7. 函数类型',
      category: '函数',
      what: '为函数定义参数和返回值类型',
      why: '确保函数调用的类型安全',
      how: 'function add(a: number, b: number): number { return a + b; }',
      sugar: '函数签名的类型化',
      scenarios: ['API 函数', '回调函数', '高阶函数'],
      relations: ['与泛型结合', '支持函数重载'],
      code: `// 函数声明
function add(a: number, b: number): number {
  return a + b;
}

// 函数表达式
const multiply: (a: number, b: number) => number = (a, b) => a * b;

// 可选参数
function greet(name: string, greeting?: string): string {
  return \`\${greeting || "Hello"}, \${name}\`;
}

// 默认参数
function createUser(name: string, age: number = 18) {
  return { name, age };
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// this 类型
function setName(this: HTMLElement, name: string) {
  this.textContent = name;
}`,
    },
    {
      title: '8. 函数重载',
      category: '函数',
      what: '为同一函数提供多个类型签名',
      why: '支持不同参数类型的函数调用',
      how: '多个签名定义 + 一个实现',
      sugar: '类型级别的函数多态',
      scenarios: ['工具函数', 'API 封装', '类型转换'],
      relations: ['与联合类型互补', '实现必须兼容所有签名'],
      code: `// 函数重载
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;
function format(value: string | number | boolean): string {
  return String(value);
}

// 使用
format("hello"); // string
format(123); // string
format(true); // string

// 更复杂的重载
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}`,
    },
    {
      title: '9. 类（Class）',
      category: '类与面向对象',
      what: 'TypeScript 的类支持访问修饰符和类型注解',
      why: '提供面向对象编程能力',
      how: 'class User { constructor(public name: string) {} }',
      sugar: '对 ES6 class 的类型增强',
      scenarios: ['数据模型', '服务类', '组件基类'],
      relations: ['可以实现接口', '支持继承和抽象类'],
      code: `// 基础类
class User {
  name: string;
  age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  greet(): string {
    return \`Hello, I'm \${this.name}\`;
  }
}

// 访问修饰符
class Person {
  public name: string; // 公开
  private age: number; // 私有
  protected email: string; // 受保护
  readonly id: string; // 只读
  
  constructor(name: string, age: number, email: string, id: string) {
    this.name = name;
    this.age = age;
    this.email = email;
    this.id = id;
  }
}

// 参数属性简写
class Student {
  constructor(
    public name: string,
    private grade: number
  ) {}
}`,
    },
    {
      title: '10. 类继承与实现',
      category: '类与面向对象',
      what: '类可以继承其他类，实现接口',
      why: '代码复用和契约约束',
      how: 'class Admin extends User implements Authorized {}',
      sugar: '面向对象的继承机制',
      scenarios: ['类层次结构', '多态', '接口实现'],
      relations: ['与接口配合', '支持抽象类'],
      code: `// 继承
class Animal {
  constructor(public name: string) {}
  
  move(distance: number): void {
    console.log(\`\${this.name} moved \${distance}m\`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log("Woof!");
  }
}

// 实现接口
interface Flyable {
  fly(): void;
}

class Bird extends Animal implements Flyable {
  fly(): void {
    console.log(\`\${this.name} is flying\`);
  }
}

// 抽象类
abstract class Shape {
  abstract area(): number;
  
  describe(): string {
    return \`Area: \${this.area()}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}`,
    },
    {
      title: '11. 泛型基础',
      category: '泛型系统',
      what: '参数化类型，让类型可以像变量一样传递',
      why: '提高代码复用性，保持类型安全',
      how: 'function identity<T>(arg: T): T { return arg; }',
      sugar: '类型级别的函数参数',
      scenarios: ['通用工具函数', '数据结构', 'API 封装'],
      relations: ['与类型推断配合', '支持约束和默认值'],
      code: `// 基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

identity<string>("hello"); // 显式指定
identity(123); // 自动推断

// 泛型数组
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 多个泛型参数
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

// 泛型接口
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 123 };`,
    },
    {
      title: '12. 泛型约束',
      category: '泛型系统',
      what: '使用 extends 限制泛型的类型范围',
      why: '确保泛型参数具有特定属性或方法',
      how: 'function log<T extends { length: number }>(arg: T): T',
      sugar: '类型级别的条件约束',
      scenarios: ['需要特定属性的泛型', '类型安全的工具函数'],
      relations: ['与接口配合', '支持多重约束'],
      code: `// 泛型约束
interface Lengthy {
  length: number;
}

function logLength<T extends Lengthy>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello"); // 正确
logLength([1, 2, 3]); // 正确
// logLength(123); // 错误

// keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 25 };
getProperty(user, "name"); // 正确
// getProperty(user, "email"); // 错误

// 默认泛型
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}`,
    },
    {
      title: '13. 类型推断',
      category: '类型推断与断言',
      what: 'TypeScript 自动推导变量和函数的类型',
      why: '减少类型注解，提高开发效率',
      how: 'let count = 10; // 自动推断为 number',
      sugar: '编译器的智能分析',
      scenarios: ['变量初始化', '函数返回值', '泛型推断'],
      relations: ['与类型注解互补', '支持上下文推断'],
      code: `// 基础推断
let count = 10; // number
let name = "Alice"; // string
let isActive = true; // boolean

// 数组推断
let numbers = [1, 2, 3]; // number[]
let mixed = [1, "hello"]; // (number | string)[]

// 函数返回值推断
function add(a: number, b: number) {
  return a + b; // 推断返回 number
}

// 上下文推断
window.addEventListener("click", (e) => {
  // e 自动推断为 MouseEvent
  console.log(e.clientX);
});

// 最佳通用类型推断
let items = [1, null]; // (number | null)[]`,
    },
    {
      title: '14. 类型断言',
      category: '类型推断与断言',
      what: '手动告诉编译器变量的类型',
      why: '当你比编译器更了解类型时使用',
      how: 'const input = document.querySelector("input") as HTMLInputElement;',
      sugar: '强制类型转换',
      scenarios: ['DOM 操作', 'API 响应', '类型收窄'],
      relations: ['与类型守卫互补', '谨慎使用'],
      code: `// as 断言
const input = document.querySelector("input") as HTMLInputElement;
input.value = "hello";

// 尖括号断言（JSX 中不可用）
const value = <string>someValue;

// 非空断言
function process(value: string | null) {
  console.log(value!.toUpperCase()); // 断言不为 null
}

// 双重断言（谨慎使用）
const value = "hello" as unknown as number;

// const 断言
const config = {
  host: "localhost",
  port: 8080
} as const; // 所有属性变为 readonly 字面量类型`,
    },
    {
      title: '15. 类型守卫',
      category: '类型推断与断言',
      what: '通过条件判断收窄类型范围',
      why: '安全地处理联合类型',
      how: 'if (typeof value === "string") { ... }',
      sugar: '类型安全的条件判断',
      scenarios: ['联合类型处理', '可选属性访问', '类型区分'],
      relations: ['与联合类型配合', '支持自定义守卫'],
      code: `// typeof 守卫
function print(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// instanceof 守卫
class Dog {
  bark() { console.log("Woof!"); }
}

function handle(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  }
}

// in 守卫
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === "string";
}`,
    },
    {
      title: '16. keyof 操作符',
      category: '高级类型',
      what: '获取对象类型的所有键的联合类型',
      why: '类型安全的属性访问',
      how: 'type Keys = keyof User; // "name" | "age"',
      sugar: '类型级别的 Object.keys',
      scenarios: ['动态属性访问', '工具类型', '映射类型'],
      relations: ['与索引访问配合', '与泛型约束结合'],
      code: `// keyof 基础
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKeys = keyof User; // "name" | "age" | "email"

// 结合泛型
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

getProperty(user, "name"); // string
getProperty(user, "age"); // number

// keyof 与索引签名
type Dictionary = {
  [key: string]: number;
};

type DictKeys = keyof Dictionary; // string | number`,
    },
    {
      title: '17. typeof 操作符',
      category: '高级类型',
      what: '获取变量的类型',
      why: '从值推导类型',
      how: 'const config = {...}; type Config = typeof config;',
      sugar: '值到类型的转换',
      scenarios: ['配置对象', '常量类型', '类型复用'],
      relations: ['与 keyof 配合', '与 ReturnType 结合'],
      code: `// typeof 基础
const user = {
  name: "Alice",
  age: 25
};

type User = typeof user; // { name: string; age: number }

// 结合 const 断言
const config = {
  host: "localhost",
  port: 8080
} as const;

type Config = typeof config;
// { readonly host: "localhost"; readonly port: 8080 }

// 获取函数类型
function add(a: number, b: number): number {
  return a + b;
}

type AddType = typeof add; // (a: number, b: number) => number`,
    },
    {
      title: '18. 索引访问类型',
      category: '高级类型',
      what: '通过索引获取类型的属性类型',
      why: '提取嵌套类型',
      how: 'type Name = User["name"]; // string',
      sugar: '类型级别的属性访问',
      scenarios: ['提取属性类型', '嵌套类型访问'],
      relations: ['与 keyof 配合', '支持联合类型索引'],
      code: `// 索引访问
interface User {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

type Name = User["name"]; // string
type Address = User["address"]; // { city: string; country: string }
type City = User["address"]["city"]; // string

// 联合类型索引
type NameOrAge = User["name" | "age"]; // string | number

// 数组元素类型
type StringArray = string[];
type ArrayElement = StringArray[number]; // string`,
    },
    {
      title: '19. 映射类型',
      category: '高级类型',
      what: '基于现有类型创建新类型',
      why: '批量转换类型属性',
      how: 'type Readonly<T> = { readonly [K in keyof T]: T[K] }',
      sugar: '类型级别的对象遍历',
      scenarios: ['工具类型', '类型转换', '属性修饰'],
      relations: ['与 keyof 配合', '是工具类型的基础'],
      code: `// 基础映射类型
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

// 使用
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number }

type PartialUser = Optional<User>;
// { name?: string; age?: number }

// 键名重映射
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }`,
    },
    {
      title: '20. 条件类型',
      category: '高级类型',
      what: '根据条件选择类型',
      why: '类型级别的逻辑判断',
      how: 'type IsString<T> = T extends string ? true : false',
      sugar: '类型级别的三元运算符',
      scenarios: ['类型判断', '类型提取', '工具类型'],
      relations: ['与 infer 配合', '支持分布式条件类型'],
      code: `// 基础条件类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// 提取返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number): number {
  return a + b;
}

type AddReturn = ReturnType<typeof add>; // number

// 分布式条件类型
type ToArray<T> = T extends any ? T[] : never;

type StrOrNum = string | number;
type Arrays = ToArray<StrOrNum>; // string[] | number[]`,
    },
    {
      title: '21. infer 关键字',
      category: '高级类型',
      what: '在条件类型中提取类型',
      why: '动态推导类型信息',
      how: 'type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never',
      sugar: '类型级别的模式匹配',
      scenarios: ['提取函数返回类型', '提取 Promise 值类型', '工具类型'],
      relations: ['只能在条件类型中使用', '与泛型配合'],
      code: `// 提取返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 提取参数类型
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// 提取 Promise 值类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

type Result = Awaited<Promise<string>>; // string

// 提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : never;

type Num = ElementType<number[]>; // number`,
    },
    {
      title: '22. 模板字面量类型',
      category: '高级类型',
      what: '使用模板字符串语法创建类型',
      why: '动态生成字符串类型',
      how: 'type EventName = \`on\${Capitalize<string>}\`',
      sugar: '类型级别的字符串拼接',
      scenarios: ['事件名称', 'CSS 类名', 'API 路径'],
      relations: ['与映射类型配合', '支持类型推断'],
      code: `// 基础模板字面量类型
type World = "world";
type Greeting = \`hello \${World}\`; // "hello world"

// 结合联合类型
type Color = "red" | "blue" | "green";
type HexColor = \`#\${Color}\`; // "#red" | "#blue" | "#green"

// 事件名称
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type ClickEvent = EventName<"click">; // "onClick"

// 结合映射类型
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};`,
    },
    {
      title: '23. satisfies 操作符',
      category: '高级类型',
      what: '校验类型但保留原推断',
      why: '既要类型检查，又要保留字面量类型',
      how: 'const config = {...} satisfies Config',
      sugar: '类型检查与推断的平衡',
      scenarios: ['配置对象', '常量定义', '类型验证'],
      relations: ['与 as const 互补', 'TypeScript 4.9+ 特性'],
      code: `// satisfies 基础
type Config = {
  host: string;
  port: number;
};

const config = {
  host: "localhost",
  port: 8080
} satisfies Config;

// config.host 推断为 "localhost" 而不是 string
// config.port 推断为 8080 而不是 number

// 对比 as const
const config2 = {
  host: "localhost",
  port: 8080
} as const;
// 所有属性都是 readonly

// 对比类型注解
const config3: Config = {
  host: "localhost",
  port: 8080
};
// config3.host 是 string，丢失了字面量类型`,
    },
    {
      title: '24. Utility Types - Partial & Required',
      category: '工具类型',
      what: 'Partial<T> 所有属性可选，Required<T> 所有属性必填',
      why: '快速转换类型属性',
      how: 'type PartialUser = Partial<User>',
      sugar: '内置的映射类型',
      scenarios: ['表单数据', 'API 更新', '配置对象'],
      relations: ['基于映射类型实现', '与其他工具类型组合'],
      code: `interface User {
  name: string;
  age: number;
  email: string;
}

// Partial - 所有属性可选
type PartialUser = Partial<User>;
// { name?: string; age?: number; email?: string }

function updateUser(user: User, updates: Partial<User>) {
  return { ...user, ...updates };
}

// Required - 所有属性必填
interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number }`,
    },
    {
      title: '25. Utility Types - Pick & Omit',
      category: '工具类型',
      what: 'Pick<T, K> 挑选属性，Omit<T, K> 排除属性',
      why: '从现有类型创建子集',
      how: 'type UserPreview = Pick<User, "name" | "age">',
      sugar: '类型级别的属性筛选',
      scenarios: ['API 响应简化', '表单字段选择', '数据脱敏'],
      relations: ['与 keyof 配合', '互为补集'],
      code: `interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
}

// Pick - 挑选属性
type UserPreview = Pick<User, "name" | "age">;
// { name: string; age: number }

// Omit - 排除属性
type UserWithoutPassword = Omit<User, "password">;
// { id: string; name: string; age: number; email: string }

// 组合使用
type PublicUser = Omit<User, "password" | "email">;
// { id: string; name: string; age: number }`,
    },
    {
      title: '26. Utility Types - Record',
      category: '工具类型',
      what: 'Record<K, T> 生成键值映射类型',
      why: '快速创建对象类型',
      how: 'type UserMap = Record<string, User>',
      sugar: '索引签名的简写',
      scenarios: ['字典对象', '映射表', '配置对象'],
      relations: ['与联合类型配合', '类型安全的对象'],
      code: `// Record 基础
type UserMap = Record<string, User>;
// { [key: string]: User }

// 结合联合类型
type Page = "home" | "about" | "contact";
type PageConfig = Record<Page, { title: string; path: string }>;

const config: PageConfig = {
  home: { title: "Home", path: "/" },
  about: { title: "About", path: "/about" },
  contact: { title: "Contact", path: "/contact" }
};

// 数字键
type StatusCode = Record<number, string>;
const codes: StatusCode = {
  200: "OK",
  404: "Not Found",
  500: "Server Error"
};`,
    },
    {
      title: '27. Utility Types - Extract & Exclude',
      category: '工具类型',
      what: 'Extract<A, B> 提取类型，Exclude<A, B> 排除类型',
      why: '联合类型的筛选',
      how: 'type StringOrNumber = Extract<string | number | boolean, string | number>',
      sugar: '类型级别的集合运算',
      scenarios: ['类型过滤', '联合类型处理'],
      relations: ['与条件类型相关', '互为补集'],
      code: `// Extract - 提取类型
type T1 = Extract<string | number | boolean, string | number>;
// string | number

type T2 = Extract<"a" | "b" | "c", "a" | "d">;
// "a"

// Exclude - 排除类型
type T3 = Exclude<string | number | boolean, string | number>;
// boolean

type T4 = Exclude<"a" | "b" | "c", "a" | "d">;
// "b" | "c"

// 实际应用
type Event = "click" | "scroll" | "mousemove";
type ClickEvent = Extract<Event, "click">; // "click"
type NonClickEvent = Exclude<Event, "click">; // "scroll" | "mousemove"`,
    },
    {
      title: '28. Utility Types - ReturnType & Parameters',
      category: '工具类型',
      what: 'ReturnType<T> 获取函数返回类型，Parameters<T> 获取参数类型',
      why: '从函数提取类型信息',
      how: 'type Result = ReturnType<typeof add>',
      sugar: '函数类型的解构',
      scenarios: ['API 封装', '类型推导', '工具函数'],
      relations: ['与 typeof 配合', '基于 infer 实现'],
      code: `// ReturnType
function add(a: number, b: number): number {
  return a + b;
}

type AddReturn = ReturnType<typeof add>; // number

async function fetchUser() {
  return { name: "Alice", age: 25 };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
// { name: string; age: number }

// Parameters
type AddParams = Parameters<typeof add>; // [number, number]

function greet(name: string, greeting: string = "Hello") {
  return \`\${greeting}, \${name}\`;
}

type GreetParams = Parameters<typeof greet>; // [string, string?]`,
    },
    {
      title: '29. Utility Types - NonNullable & Awaited',
      category: '工具类型',
      what: 'NonNullable<T> 去除 null/undefined，Awaited<T> 推导 Promise 结果',
      why: '处理可空类型和异步类型',
      how: 'type Value = NonNullable<string | null>',
      sugar: '类型级别的空值处理',
      scenarios: ['可空类型处理', 'Promise 类型推导'],
      relations: ['与 Exclude 相关', '与 async/await 配合'],
      code: `// NonNullable
type T1 = NonNullable<string | null | undefined>; // string
type T2 = NonNullable<string | number | null>; // string | number

function process(value: string | null) {
  if (value !== null) {
    const safeValue: NonNullable<typeof value> = value;
    console.log(safeValue.toUpperCase());
  }
}

// Awaited
type T3 = Awaited<Promise<string>>; // string
type T4 = Awaited<Promise<Promise<number>>>; // number

async function fetchData(): Promise<{ name: string }> {
  return { name: "Alice" };
}

type Data = Awaited<ReturnType<typeof fetchData>>;
// { name: string }`,
    },
    {
      title: '30. 严格模式配置',
      category: '最佳实践',
      what: 'tsconfig.json 中的 strict: true 启用所有严格检查',
      why: '最大化类型安全',
      how: '在 tsconfig.json 中设置 "strict": true',
      sugar: '编译器配置',
      scenarios: ['新项目', '类型安全要求高的项目'],
      relations: ['包含多个子选项', '推荐默认开启'],
      code: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格检查
    
    // strict 包含以下选项：
    "noImplicitAny": true, // 禁止隐式 any
    "strictNullChecks": true, // 严格空值检查
    "strictFunctionTypes": true, // 严格函数类型检查
    "strictBindCallApply": true, // 严格 bind/call/apply
    "strictPropertyInitialization": true, // 严格属性初始化
    "noImplicitThis": true, // 禁止隐式 this
    "alwaysStrict": true // 始终使用严格模式
  }
}

// 示例：strictNullChecks
let value: string;
// value.toUpperCase(); // 错误：使用前未赋值

let nullable: string | null = null;
// nullable.toUpperCase(); // 错误：可能为 null`,
    },
  ];

  const resources = [
    { name: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/docs/', description: '最权威的 TypeScript 文档' },
    { name: 'TypeScript 中文手册', url: 'https://www.tslang.cn/', description: '中文版 TypeScript 手册' },
    { name: 'Type Challenges', url: 'https://github.com/type-challenges/type-challenges', description: 'TypeScript 类型体操练习' },
    { name: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/', description: '深入理解 TypeScript' },
    { name: 'TS Playground', url: 'https://www.typescriptlang.org/play', description: '在线 TypeScript 编辑器' },
    { name: 'Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html', description: '内置工具类型文档' },
  ];

  const summary = {
    philosophy: 'TypeScript = JavaScript + 类型系统（静态保障） + 编译期智能提示（开发体验）',
    core: '在不改变 JS 语义的前提下，让错误提前暴露在编译期',
    suggestion: '按「点 → 面 → 线」学习：先掌握单个特性，再理解使用场景，最后建立特性间的关联',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=mid" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            TypeScript 类型系统
          </h1>
          <p className="text-gray-600">
            系统掌握 TypeScript 5.6 的类型系统哲学，提升代码质量与开发体验
          </p>
        </div>

        {/* 核心理念卡片 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">TypeScript 核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">一句话定义：</span>
                {summary.philosophy}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">核心目标：</span>
                {summary.core}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">学习建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和分类 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    是什么
                  </h3>
                  <p className="text-sm text-gray-700">{section.what}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-green-600">🎯</span>
                    为什么
                  </h3>
                  <p className="text-sm text-gray-700">{section.why}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">⚡</span>
                    怎么用
                  </h3>
                  <code className="text-sm text-gray-700 font-mono">{section.how}</code>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-yellow-600">🍬</span>
                    语法糖
                  </h3>
                  <p className="text-sm text-gray-700">{section.sugar}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 关联关系 */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">→</span>
                      <span>{relation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* TypeScript vs JavaScript 对比 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">TypeScript 解决的问题</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">问题</th>
                  <th className="text-left p-3 bg-gray-50">传统 JS 的缺陷</th>
                  <th className="text-left p-3 bg-gray-50">TypeScript 提供的解决</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">动态类型易出错</td>
                  <td className="p-3 text-gray-600">类型随时变化</td>
                  <td className="p-3 text-green-700">静态类型检查，提前发现错误</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">缺乏自文档化</td>
                  <td className="p-3 text-gray-600">看代码不知类型</td>
                  <td className="p-3 text-green-700">类型定义就是文档</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">IDE 智能提示差</td>
                  <td className="p-3 text-gray-600">难以推断接口</td>
                  <td className="p-3 text-green-700">自动推导类型、智能补全</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">维护大型项目困难</td>
                  <td className="p-3 text-gray-600">难以约束多人协作</td>
                  <td className="p-3 text-green-700">类型系统带来可预测性</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">无法轻松重构</td>
                  <td className="p-3 text-gray-600">改动易出连锁反应</td>
                  <td className="p-3 text-green-700">类型系统防止潜在破坏</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 类型系统关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">TypeScript 核心逻辑</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`┌───────────────────────────────────────────┐
│          TypeScript 核心逻辑              │
├───────────────────────────────────────────┤
│ 语法层（JS语义兼容）                      │
│      ↓                                    │
│ 类型层（定义结构） → 接口 / 泛型 / 工具类型 │
│      ↓                                    │
│ 类型推断与条件类型（类型编程）            │
│      ↓                                    │
│ 编译器约束 + IDE 提示 + 代码智能分析       │
│      ↓                                    │
│ 运行时 JS 输出（零运行时开销）             │
└───────────────────────────────────────────┘

基础类型 → 联合/交叉类型 → 字面量类型
    ↓
接口/类型别名 → 泛型 → 泛型约束
    ↓
函数类型 → 函数重载 → 类型守卫
    ↓
类 → 继承/实现 → 抽象类
    ↓
keyof/typeof → 索引访问 → 映射类型
    ↓
条件类型 → infer → 模板字面量类型
    ↓
工具类型（Partial/Pick/Record/...）`}
            </pre>
          </div>
        </Card>

        {/* 工具类型速查表 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">内置工具类型速查</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { type: 'Partial<T>', desc: '所有属性可选' },
              { type: 'Required<T>', desc: '所有属性必填' },
              { type: 'Readonly<T>', desc: '所有属性只读' },
              { type: 'Pick<T, K>', desc: '挑选部分属性' },
              { type: 'Omit<T, K>', desc: '排除部分属性' },
              { type: 'Record<K, T>', desc: '生成键值映射类型' },
              { type: 'ReturnType<T>', desc: '获取函数返回类型' },
              { type: 'Parameters<T>', desc: '获取函数参数类型' },
              { type: 'Extract<A, B>', desc: '从 A 中提取 B 类型' },
              { type: 'Exclude<A, B>', desc: '从 A 中排除 B 类型' },
              { type: 'NonNullable<T>', desc: '去除 null / undefined' },
              { type: 'Awaited<T>', desc: '推导 Promise 结果类型' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between gap-2">
                  <code className="font-semibold text-blue-700 text-sm">{item.type}</code>
                  <span className="text-xs text-gray-600">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 最佳实践 */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">现代最佳实践</h2>
          <div className="space-y-2">
            {[
              '✅ 使用 strict: true 模式（启用所有严格类型检查）',
              '✅ 使用 type 统一定义结构，interface 用于对象',
              '✅ 利用 satisfies 检查而非断言',
              '✅ 优先使用 unknown 而非 any',
              '✅ 结合 as const 保留字面量推断',
              '✅ 用泛型封装复用逻辑',
              '✅ 避免过度类型体操，保持可读性',
              '✅ 使用类型守卫而非类型断言',
              '✅ 为公共 API 提供完整类型定义',
              '✅ 利用 IDE 的类型提示和自动补全',
            ].map((practice, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 使用场景 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">TypeScript 使用场景</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">场景</th>
                  <th className="text-left p-3 bg-gray-50">类型系统价值</th>
                  <th className="text-left p-3 bg-gray-50">示例</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">前端项目（React/Vue）</td>
                  <td className="p-3 text-gray-600">props、state、API类型安全</td>
                  <td className="p-3"><code className="text-xs">PropsWithChildren, defineProps&lt;T&gt;()</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">后端（Node/Nest.js）</td>
                  <td className="p-3 text-gray-600">DTO、服务契约、接口定义</td>
                  <td className="p-3"><code className="text-xs">类型化路由与验证</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">跨端/SDK</td>
                  <td className="p-3 text-gray-600">公共接口共享</td>
                  <td className="p-3"><code className="text-xs">同类型在多平台复用</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">工具库/组件库开发</td>
                  <td className="p-3 text-gray-600">泛型增强复用性</td>
                  <td className="p-3"><code className="text-xs">Ant Design, React Query</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">大型协作项目</td>
                  <td className="p-3 text-gray-600">强制规范 + 可维护</td>
                  <td className="p-3"><code className="text-xs">降低认知负担，自动提示</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 与相关技术的关系 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">与相关技术的关系</h2>
          <div className="space-y-3">
            {[
              { tech: 'JavaScript', relation: 'TS 是 JS 的超集', desc: '所有 JS 都是合法 TS' },
              { tech: 'React / Vue / Svelte', relation: '与 TS 深度集成', desc: 'JSX、props、emit 类型支持' },
              { tech: 'Node.js / Deno / Bun', relation: '原生支持 TS 或可编译', desc: '后端同样获益' },
              { tech: 'Babel / SWC / esbuild', relation: '用于转译 TS → JS', desc: 'TS 编译链优化' },
              { tech: 'eslint / tsc --noEmit', relation: '用于类型检查', desc: '仅检查不输出代码' },
              { tech: 'JSDoc + TS Check', relation: '轻量类型注释', desc: 'JS 文件也可获类型保护' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{item.tech}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {item.relation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">TypeScript 是给 JavaScript 加上的「编译期守护神」</span>
            </p>
            <p className="text-sm text-gray-600">
              它不改变你的代码逻辑，只是提前帮你"预见崩溃"
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
