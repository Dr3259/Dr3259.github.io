'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Zap, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function GraphQLPage() {
  const resources = [
    { name: 'GraphQL 官方文档', url: 'https://graphql.org/', description: 'GraphQL 完整文档和规范' },
    { name: 'Apollo GraphQL', url: 'https://www.apollographql.com/', description: 'Apollo 客户端和服务端文档' },
    { name: 'GraphiQL', url: 'https://github.com/graphql/graphiql', description: 'GraphQL 可视化调试工具' },
    { name: 'How to GraphQL', url: 'https://www.howtographql.com/', description: 'GraphQL 完整教程' },
    { name: 'GitHub GraphQL API', url: 'https://docs.github.com/en/graphql', description: 'GitHub 的 GraphQL API 示例' },
    { name: 'GraphQL Code Generator', url: 'https://the-guild.dev/graphql/codegen', description: 'TypeScript 类型自动生成' },
  ];

  const sections = [
    {
      title: '1. Schema（模式定义）',
      category: '核心概念',
      what: 'GraphQL 服务的数据模型定义，是类型系统的核心',
      why: '统一约束数据结构，让前后端都有"契约"',
      how: '使用 SDL（Schema Definition Language）定义',
      sugar: '! 表示非空，[] 表示数组',
      scenarios: ['API 设计', '类型约束', '前后端协作', '自动文档'],
      relations: ['是 GraphQL 的基础', '决定所有操作的数据结构'],
      code: `// 定义用户类型
type User {
  id: ID!              // ! 表示非空
  name: String!
  age: Int
  email: String
  posts: [Post!]!      // 非空数组，元素也非空
}

// 定义文章类型
type Post {
  id: ID!
  title: String!
  content: String
  author: User!        // 关联用户
  comments: [Comment!]!
}

// 定义评论类型
type Comment {
  id: ID!
  content: String!
  author: User!
}

// 定义查询入口
type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
}

// 定义变更入口
type Mutation {
  createUser(name: String!, age: Int): User!
  updateUser(id: ID!, name: String): User
  deleteUser(id: ID!): Boolean!
}`,
    },
    {
      title: '2. Query（查询）',
      category: '核心概念',
      what: 'GraphQL 的读取操作，类似于 REST 的 GET',
      why: '允许客户端声明性地指定所需字段，避免"取太多或太少"',
      how: '嵌套查询 + 精确字段选择',
      sugar: '一个请求可跨多个资源嵌套查询',
      scenarios: ['数据获取', '嵌套查询', '精确取数', '减少请求'],
      relations: ['基于 Schema 定义', '由 Resolver 执行'],
      code: `// 基础查询
query {
  user(id: 1) {
    id
    name
    age
  }
}

// 响应
{
  "data": {
    "user": {
      "id": "1",
      "name": "Alice",
      "age": 25
    }
  }
}

// 嵌套查询
query {
  user(id: 1) {
    id
    name
    posts {
      id
      title
      comments {
        content
        author {
          name
        }
      }
    }
  }
}

// 多个查询
query {
  user1: user(id: 1) {
    name
  }
  user2: user(id: 2) {
    name
  }
  allUsers: users {
    id
    name
  }
}

// 命名查询
query GetUserWithPosts {
  user(id: 1) {
    name
    posts {
      title
    }
  }
}`,
    },
    {
      title: '3. Mutation（变更）',
      category: '核心概念',
      what: '修改服务器数据的操作，类似 REST 的 POST/PUT/DELETE',
      why: '区分"读"和"写"，方便跟踪副作用',
      how: 'mutation { createUser(...) { ... } }',
      sugar: '支持返回结果，可链式返回创建的数据对象',
      scenarios: ['创建数据', '更新数据', '删除数据', '批量操作'],
      relations: ['与 Query 并列', '通常有副作用'],
      code: `// 创建用户
mutation {
  createUser(name: "Bob", age: 30) {
    id
    name
    age
  }
}

// 响应
{
  "data": {
    "createUser": {
      "id": "2",
      "name": "Bob",
      "age": 30
    }
  }
}

// 更新用户
mutation {
  updateUser(id: "1", name: "Alice Updated") {
    id
    name
  }
}

// 删除用户
mutation {
  deleteUser(id: "1")
}

// 多个变更（按顺序执行）
mutation {
  user1: createUser(name: "User1") {
    id
  }
  user2: createUser(name: "User2") {
    id
  }
}

// 带输入类型的变更
mutation {
  createPost(input: {
    title: "GraphQL Tutorial"
    content: "Learn GraphQL"
    authorId: "1"
  }) {
    id
    title
    author {
      name
    }
  }
}`,
    },
    {
      title: '4. Subscription（订阅）',
      category: '核心概念',
      what: '基于 WebSocket 的实时数据推送机制',
      why: '适合聊天、通知、股票等实时场景',
      how: 'subscription { messageAdded { ... } }',
      sugar: '客户端订阅后，服务端数据变动时自动推送',
      scenarios: ['实时聊天', '通知推送', '股票行情', '协作编辑'],
      relations: ['需要 WebSocket 支持', '与 Query/Mutation 并列'],
      code: `// 定义订阅
type Subscription {
  messageAdded: Message!
  userOnline(userId: ID!): User!
  postUpdated(postId: ID!): Post!
}

// 客户端订阅
subscription {
  messageAdded {
    id
    content
    author {
      name
    }
    createdAt
  }
}

// 服务端推送（当有新消息时）
{
  "data": {
    "messageAdded": {
      "id": "123",
      "content": "Hello!",
      "author": {
        "name": "Alice"
      },
      "createdAt": "2024-10-24T12:00:00Z"
    }
  }
}

// 带参数的订阅
subscription {
  userOnline(userId: "1") {
    id
    name
    status
  }
}

// 使用 Apollo Client
import { useSubscription, gql } from '@apollo/client';

const MESSAGE_SUBSCRIPTION = gql\`
  subscription OnMessageAdded {
    messageAdded {
      id
      content
      author {
        name
      }
    }
  }
\`;

function Messages() {
  const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION);
  
  if (loading) return <p>Loading...</p>;
  
  return <div>{data.messageAdded.content}</div>;
}`,
    },
    {
      title: '5. Type System（类型系统）',
      category: '核心概念',
      what: 'GraphQL 内置的强类型系统',
      why: '使前后端协作更严谨，支持自动验证和类型生成',
      how: '定义各种类型：标量、对象、枚举、接口、联合',
      sugar: '类型安全 + 自动文档',
      scenarios: ['类型约束', 'TypeScript 集成', '自动验证', 'IDE 提示'],
      relations: ['是 Schema 的基础', '支持类型生成工具'],
      code: `// 标量类型（Scalar Types）
type User {
  id: ID!              // 唯一标识
  name: String!        // 字符串
  age: Int             // 整数
  score: Float         // 浮点数
  isActive: Boolean    // 布尔值
}

// 枚举类型（Enum）
enum Role {
  ADMIN
  USER
  GUEST
}

type User {
  role: Role!
}

// 输入类型（Input Type）
input CreateUserInput {
  name: String!
  age: Int
  email: String!
}

mutation {
  createUser(input: CreateUserInput!): User!
}

// 接口类型（Interface）
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Post implements Node {
  id: ID!
  title: String!
}

// 联合类型（Union）
union SearchResult = User | Post | Comment

type Query {
  search(query: String!): [SearchResult!]!
}

// 自定义标量
scalar Date
scalar JSON

type Post {
  createdAt: Date!
  metadata: JSON
}`,
    },
    {
      title: '6. Resolver（解析器）',
      category: '服务端实现',
      what: '每个字段对应的取数函数',
      why: '将 GraphQL schema 与真实数据源（数据库/API）绑定',
      how: '定义 Query、Mutation、字段的解析函数',
      sugar: '支持嵌套调用、异步数据源',
      scenarios: ['数据获取', '业务逻辑', '数据聚合', '权限控制'],
      relations: ['连接 Schema 和数据源', '是 GraphQL 的执行层'],
      code: `// Resolver 基础结构
const resolvers = {
  Query: {
    // 获取单个用户
    user: async (parent, { id }, context) => {
      return await context.db.getUserById(id);
    },
    
    // 获取用户列表
    users: async (parent, args, context) => {
      return await context.db.getAllUsers();
    },
  },
  
  Mutation: {
    // 创建用户
    createUser: async (parent, { name, age }, context) => {
      return await context.db.createUser({ name, age });
    },
    
    // 更新用户
    updateUser: async (parent, { id, name }, context) => {
      return await context.db.updateUser(id, { name });
    },
  },
  
  // 字段级 Resolver
  User: {
    // 解析用户的文章
    posts: async (parent, args, context) => {
      return await context.db.getPostsByUserId(parent.id);
    },
    
    // 计算字段
    fullName: (parent) => {
      return \`\${parent.firstName} \${parent.lastName}\`;
    },
  },
  
  Post: {
    // 解析文章的作者
    author: async (parent, args, context) => {
      return await context.db.getUserById(parent.authorId);
    },
  },
};

// Resolver 参数说明
// parent: 父级对象的返回值
// args: 查询参数
// context: 共享上下文（如数据库连接、用户信息）
// info: 查询的 AST 信息`,
    },
    {
      title: '7. Variables（变量）',
      category: '查询优化',
      what: '让查询支持动态参数而不硬编码',
      why: '前后端分离更灵活、安全（防止注入）',
      how: 'query GetUser($id: ID!) { user(id: $id) { ... } }',
      sugar: '类型安全的参数传递',
      scenarios: ['动态查询', '参数复用', '安全防护'],
      relations: ['与 Query/Mutation 配合', '支持类型验证'],
      code: `// 定义带变量的查询
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    age
  }
}

// 传递变量
{
  "id": "123"
}

// 多个变量
query GetUserPosts($userId: ID!, $limit: Int = 10) {
  user(id: $userId) {
    name
    posts(limit: $limit) {
      title
    }
  }
}

// 变量
{
  "userId": "1",
  "limit": 5
}

// 使用 Apollo Client
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
\`;

function UserProfile({ userId }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>{data.user.email}</p>
    </div>
  );
}`,
    },
    {
      title: '8. Directives（指令）',
      category: '查询优化',
      what: '控制查询行为的注解',
      why: '动态控制字段返回，提供灵活性',
      how: '@include(if: Boolean)、@skip(if: Boolean)',
      sugar: 'GraphQL 的条件语法',
      scenarios: ['条件查询', '字段控制', '废弃标注'],
      relations: ['与变量配合', '影响查询执行'],
      code: `// @include - 条件包含字段
query GetUser($id: ID!, $showEmail: Boolean!) {
  user(id: $id) {
    name
    email @include(if: $showEmail)
  }
}

// 变量
{
  "id": "1",
  "showEmail": true
}

// @skip - 条件跳过字段
query GetUser($id: ID!, $hideAge: Boolean!) {
  user(id: $id) {
    name
    age @skip(if: $hideAge)
  }
}

// @deprecated - 标注废弃字段
type User {
  name: String!
  oldField: String @deprecated(reason: "Use newField instead")
  newField: String
}

// 自定义指令
directive @auth(requires: Role = USER) on FIELD_DEFINITION

type Query {
  adminData: String @auth(requires: ADMIN)
  userData: String @auth(requires: USER)
}

// 组合使用
query GetUser($id: ID!, $showPosts: Boolean!, $hideSensitive: Boolean!) {
  user(id: $id) {
    name
    email @skip(if: $hideSensitive)
    posts @include(if: $showPosts) {
      title
    }
  }
}`,
    },
    {
      title: '9. Fragments（片段）',
      category: '查询优化',
      what: '可重用的字段集合',
      why: '避免重复字段，提升复用性',
      how: 'fragment UserFields on User { ... }',
      sugar: '类似函数抽取',
      scenarios: ['字段复用', '组件化查询', '减少重复'],
      relations: ['可在多个查询中使用', '支持嵌套'],
      code: `// 定义 Fragment
fragment UserFields on User {
  id
  name
  email
}

// 使用 Fragment
query {
  user(id: 1) {
    ...UserFields
    age
  }
}

// 嵌套 Fragment
fragment PostFields on Post {
  id
  title
  author {
    ...UserFields
  }
}

query {
  post(id: 1) {
    ...PostFields
    content
  }
}

// 内联 Fragment（联合类型）
query {
  search(query: "graphql") {
    ... on User {
      name
      email
    }
    ... on Post {
      title
      content
    }
    ... on Comment {
      content
    }
  }
}

// 在 Apollo Client 中使用
import { gql } from '@apollo/client';

const USER_FIELDS = gql\`
  fragment UserFields on User {
    id
    name
    email
  }
\`;

const GET_USER = gql\`
  \${USER_FIELDS}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
      posts {
        title
      }
    }
  }
\`;`,
    },
    {
      title: '10. Introspection（自省）',
      category: '高级特性',
      what: 'GraphQL 自带的自描述能力',
      why: '让客户端自动发现 schema，用于工具开发',
      how: '__schema、__type 查询',
      sugar: '自动生成文档和类型',
      scenarios: ['工具开发', '自动文档', 'IDE 提示', '类型生成'],
      relations: ['是 GraphQL 的元编程能力', '支持 GraphiQL 等工具'],
      code: `// 查询所有类型
{
  __schema {
    types {
      name
      kind
      description
    }
  }
}

// 查询特定类型
{
  __type(name: "User") {
    name
    kind
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}

// 查询查询类型
{
  __schema {
    queryType {
      name
      fields {
        name
        type {
          name
        }
      }
    }
  }
}

// 完整的 Schema 查询
{
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      name
      kind
      description
      fields {
        name
        description
        type {
          name
          kind
        }
      }
    }
  }
}

// 生产环境通常禁用自省
// 防止暴露 API 结构`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend/mid/api" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回网络与 API
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            GraphQL 基础
          </h1>
          <p className="text-gray-600">
            客户端驱动的数据语言 —— 从"资源取数"进化为"数据声明"
          </p>
        </div>

        {/* 核心理念 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">定义：</span>
                GraphQL 是一种用于 API 的查询语言，也是一个执行这些查询的运行时
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-pink-700">核心思想：</span>
                客户端精确地声明需要的数据结构，服务端精确返回对应的数据
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">特点：</span>
                单一端点 + 类型系统 + 自省机制 + 实时订阅
              </p>
            </div>
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

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

              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

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

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* GraphQL vs REST 对比 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">GraphQL vs REST 对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">对比项</th>
                  <th className="text-left p-3 bg-blue-50">REST</th>
                  <th className="text-left p-3 bg-purple-50">GraphQL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">结构</td>
                  <td className="p-3 text-gray-600">多个端点</td>
                  <td className="p-3 text-gray-600">单一端点</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">请求方式</td>
                  <td className="p-3 text-gray-600">多个 HTTP 动词</td>
                  <td className="p-3 text-gray-600">单一 POST（或 GET）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">返回数据</td>
                  <td className="p-3 text-gray-600">固定结构</td>
                  <td className="p-3 text-gray-600">客户端定义</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">数据聚合</td>
                  <td className="p-3 text-gray-600">多请求</td>
                  <td className="p-3 text-gray-600">一次嵌套查询</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">文档维护</td>
                  <td className="p-3 text-gray-600">手写</td>
                  <td className="p-3 text-gray-600">自动生成（自省）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">实时支持</td>
                  <td className="p-3 text-gray-600">弱</td>
                  <td className="p-3 text-gray-600">原生支持（Subscription）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">缺点</td>
                  <td className="p-3 text-gray-600">数据冗余/过取/少取</td>
                  <td className="p-3 text-gray-600">后端实现复杂，缓存困难</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 架构体系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">GraphQL 架构体系</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`┌────────────────────────────────────────┐
│            GraphQL 体系                │
├────────────────────────────────────────┤
│ Schema 定义层（类型 + 输入 + 枚举）     │
│    ↓                                    │
│ Query / Mutation / Subscription 操作层   │
│    ↓                                    │
│ Resolver（解析器）连接数据源（DB/API）   │
│    ↓                                    │
│ 数据返回 JSON（仅请求字段）             │
│    ↓                                    │
│ 客户端使用 Apollo / Relay / urql 接收   │
└────────────────────────────────────────┘

核心线索：
Schema 决定系统形态 → Query 定义客户端需求 
→ Resolver 负责数据实现 → Response 精确返回`}
            </pre>
          </div>
        </Card>

        {/* 生态工具链 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">GraphQL 生态工具链</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { category: 'Server', tools: 'Apollo Server / Yoga / Mercurius', desc: '服务端实现' },
              { category: 'Client', tools: 'Apollo Client / Relay / urql', desc: '客户端管理' },
              { category: 'IDE', tools: 'GraphiQL / Apollo Sandbox', desc: '可视化调试' },
              { category: 'Gateway', tools: 'Apollo Federation / Hasura / Mesh', desc: '聚合多源数据' },
              { category: 'Schema 工具', tools: 'graphql-codegen / Nexus / TypeGraphQL', desc: '类型生成、自动化' },
              { category: 'Testing', tools: 'GraphQL Testing Library', desc: '测试工具' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">{item.tools}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
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

        {/* 最佳实践 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">GraphQL 最佳实践</h2>
          <div className="space-y-3">
            {[
              '✅ 使用强类型 Schema 定义所有数据结构',
              '✅ 合理设计 Resolver，避免 N+1 查询问题',
              '✅ 使用 DataLoader 进行批量查询和缓存',
              '✅ 实现分页（Cursor-based 或 Offset-based）',
              '✅ 使用 Fragment 复用字段',
              '✅ 生产环境禁用 Introspection',
              '✅ 实现查询复杂度限制和深度限制',
              '✅ 使用 Apollo Client 的缓存机制',
              '✅ 为敏感操作添加权限验证',
              '✅ 使用 graphql-codegen 生成 TypeScript 类型',
            ].map((practice, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border border-purple-200/50">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">GraphQL 是客户端驱动的数据语言</span>
            </p>
            <p className="text-sm text-gray-600">
              让 API 通信从"资源取数"进化为"数据声明"
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
