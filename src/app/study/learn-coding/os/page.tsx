'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Monitor, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Skill {
  title: string;
  items: string[];
  slug: string;
}

interface Level {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  skills: Skill[];
  tools: string[];
  practices: string[];
}

export default function OSPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('junior');

  useEffect(() => {
    const level = searchParams.get('level');
    if (level && ['junior', 'mid', 'senior'].includes(level)) {
      setActiveLevel(level);
    }
  }, [searchParams]);

  const toolUrls: Record<string, string> = {
    // 初级工具
    'Linux': 'https://www.linux.org/',
    'Ubuntu': 'https://ubuntu.com/',
    'Bash': 'https://www.gnu.org/software/bash/',
    'Zsh': 'https://www.zsh.org/',
    'PowerShell': 'https://docs.microsoft.com/powershell/',
    'VirtualBox': 'https://www.virtualbox.org/',
    'VMware': 'https://www.vmware.com/',
    // 中级工具
    'CentOS': 'https://www.centos.org/',
    'Debian': 'https://www.debian.org/',
    'htop': 'https://htop.dev/',
    'strace': 'https://strace.io/',
    'systemd': 'https://systemd.io/',
    // 高级工具
    'Docker': 'https://www.docker.com/',
    'Podman': 'https://podman.io/',
    'Kubernetes': 'https://kubernetes.io/',
    'KVM': 'https://www.linux-kvm.org/',
    'QEMU': 'https://www.qemu.org/',
  };

  const handleToolClick = (tool: string) => {
    const url = toolUrls[tool] || 'https://www.google.com/search?q=' + encodeURIComponent(tool);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePracticeClick = (practice: string) => {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(practice + ' 教程');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const levels: Level[] = [
    {
      id: 'junior',
      name: '初级（操作系统基础与通识）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: '操作系统基础原理',
          items: ['CPU 管理', '内存管理', '文件系统', '设备驱动', '进程调度'],
          slug: 'os-basics',
        },
        {
          title: '命令行与 Shell',
          items: ['Bash 基础', 'Zsh 配置', 'PowerShell', 'Shell 脚本', '命令管道'],
          slug: 'shell',
        },
        {
          title: 'Linux 基础命令',
          items: ['文件操作（ls/cd/cp/mv）', '文本处理（grep/sed/awk）', '进程管理（ps/top/kill）', '权限管理（chmod/chown）', '网络工具（ping/curl）'],
          slug: 'linux-commands',
        },
        {
          title: '文件系统',
          items: ['ext4 文件系统', 'NTFS', 'FAT32', 'inode 结构', '分区管理'],
          slug: 'filesystem',
        },
        {
          title: '操作系统类型',
          items: ['Windows 系统', 'macOS', 'Linux 发行版', '内核架构', '生态差异'],
          slug: 'os-types',
        },
        {
          title: '虚拟机基础',
          items: ['VirtualBox', 'VMware', '系统安装', '快照管理', '网络配置'],
          slug: 'virtual-machine',
        },
      ],
      tools: ['Linux', 'Ubuntu', 'Bash', 'Zsh', 'PowerShell', 'VirtualBox', 'VMware'],
      practices: ['Linux 系统安装', 'Shell 脚本编写', '文件权限管理', '虚拟机配置', '基础命令练习'],
    },
    {
      id: 'mid',
      name: '中级（系统结构与进程调度）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '进程与线程',
          items: ['进程创建', '线程管理', '多任务调度', '同步机制', '死锁处理'],
          slug: 'process-thread',
        },
        {
          title: '内存管理',
          items: ['分页机制', '分段机制', '虚拟内存', 'TLB 缓存', '内存分配算法'],
          slug: 'memory-management',
        },
        {
          title: '系统调用',
          items: ['Syscall 接口', '用户态与内核态', '系统调用表', 'fork/exec', 'read/write'],
          slug: 'syscall',
        },
        {
          title: 'I/O 管理',
          items: ['Buffer 缓冲', 'Cache 缓存', 'DMA 直接内存访问', 'I/O 调度', '异步 I/O'],
          slug: 'io-management',
        },
        {
          title: '中断与信号',
          items: ['硬件中断', '软件中断', '信号处理', '异常处理', 'CPU 调度'],
          slug: 'interrupt-signal',
        },
        {
          title: '进程通信（IPC）',
          items: ['管道（Pipe）', '消息队列', '共享内存', 'Socket', '信号量'],
          slug: 'ipc',
        },
        {
          title: 'Linux 发行版',
          items: ['Ubuntu', 'CentOS', 'Debian', 'apt/yum 包管理', '系统服务管理'],
          slug: 'linux-distros',
        },
        {
          title: '系统监控工具',
          items: ['htop', 'dstat', 'iostat', 'strace', 'vmstat'],
          slug: 'monitoring-tools',
        },
      ],
      tools: ['CentOS', 'Debian', 'htop', 'strace', 'systemd', 'gdb'],
      practices: ['进程管理实践', 'IPC 通信编程', '系统性能分析', '内存调优', 'Shell 高级脚本'],
    },
    {
      id: 'senior',
      name: '高级（内核、虚拟化与容器）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '内核开发与编译',
          items: ['Linux Kernel 源码', '内核编译', '内核模块（LKM）', '驱动开发', '内核调试'],
          slug: 'kernel-dev',
        },
        {
          title: '系统安全',
          items: ['SELinux', 'AppArmor', '访问控制', '安全审计', '权限隔离'],
          slug: 'system-security',
        },
        {
          title: '容器化技术',
          items: ['Docker 容器', 'Podman', 'Namespace', 'Cgroups', '容器网络'],
          slug: 'containerization',
        },
        {
          title: '虚拟化技术',
          items: ['KVM', 'QEMU', 'Hyper-V', 'Xen', '虚拟机管理'],
          slug: 'virtualization',
        },
        {
          title: '系统启动流程',
          items: ['BIOS/UEFI', 'GRUB Bootloader', 'Kernel Init', 'Systemd', 'Init 系统'],
          slug: 'boot-process',
        },
        {
          title: '容器编排',
          items: ['Kubernetes', 'OpenShift', 'Pod 管理', 'Service 网络', '自动伸缩'],
          slug: 'container-orchestration',
        },
        {
          title: '性能调优',
          items: ['内核参数调优', 'NUMA 优化', 'I/O 调度器', 'CPU 亲和性', '网络栈优化'],
          slug: 'performance-tuning',
        },
        {
          title: '云原生与分布式',
          items: ['云原生内核', '分布式操作系统', 'Google Borg', '微内核架构', '下一代系统'],
          slug: 'cloud-native',
        },
      ],
      tools: ['Docker', 'Podman', 'Kubernetes', 'KVM', 'QEMU', 'Linux Kernel'],
      practices: ['内核模块开发', 'Docker 容器化', 'K8s 集群管理', '系统性能调优', '虚拟化部署'],
    },
  ];

  const currentLevel = levels.find((l) => l.id === activeLevel) || levels[0];
  const Icon = currentLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习编程
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl shadow-lg mb-3">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            操作系统技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从 Linux 基础到内核开发，掌握系统底层原理与虚拟化技术
          </p>
        </div>

        {/* 级别选择器 */}
        <div className="flex justify-center gap-3 mb-8">
          {levels.map((level) => {
            const LevelIcon = level.icon;
            return (
              <Button
                key={level.id}
                variant={activeLevel === level.id ? 'default' : 'outline'}
                onClick={() => {
                  setActiveLevel(level.id);
                  window.history.replaceState(
                    null,
                    '',
                    `/study/learn-coding/os?level=${level.id}`
                  );
                }}
                className={`${
                  activeLevel === level.id
                    ? `bg-gradient-to-r ${level.bgColor} text-white hover:opacity-90`
                    : 'hover:bg-gray-100'
                }`}
              >
                <LevelIcon className="w-4 h-4 mr-2" />
                {level.name}
              </Button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* 核心技能 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${currentLevel.color}`} />
              <h2 className="text-2xl font-bold text-gray-800">核心技能</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {currentLevel.skills.map((skill, idx) => (
                <Card 
                  key={idx} 
                  className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-fit"
                  onClick={() => router.push(`/study/learn-coding/os/${activeLevel}/${skill.slug}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentLevel.bgColor}`} />
                      {skill.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <ul className="space-y-1.5">
                    {skill.items.map((item, i) => (
                      <li 
                        key={i} 
                        className="text-sm text-gray-600 flex items-start gap-2 hover:text-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/study/learn-coding/os/${activeLevel}/${skill.slug}#section-${i + 1}`);
                        }}
                      >
                        <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Card>

          {/* 工具与框架 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">常用工具与系统</h2>
            <div className="flex flex-wrap gap-2">
              {currentLevel.tools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToolClick(tool)}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentLevel.bgColor} text-white shadow-sm hover:opacity-90 hover:scale-105 transition-all cursor-pointer`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </Card>

          {/* 实践经验 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">实践项目与最佳实践</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLevel.practices.map((practice, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePracticeClick(practice)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentLevel.bgColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{practice}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 提示：点击任意技能卡片，查看详细学习内容和资源
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
