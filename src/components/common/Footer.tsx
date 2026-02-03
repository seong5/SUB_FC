'use client'

import Image from 'next/image'
import { Youtube, Github, ExternalLink, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-60 bg-slate-950 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Image
              src="/subfc.png"
              alt="SUB FC"
              width={32}
              height={32}
              className="rounded-full object-contain"
            />
            <span className="text-lg font-black italic tracking-tighter text-white uppercase">
              SUB FC
            </span>
          </div>

          {/* Contact + Social: 모바일 col, PC justify-between / 이메일·전화 묶음 | 유튜브·깃헙 묶음 */}
          <div className="flex flex-row md:justify-between items-stretch md:items-center gap-6 md:gap-6">
            {/* 이메일 + 전화번호 묶음 */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:greenbi0852@gmail.com"
                className="flex items-center gap-3 group cursor-pointer w-fit"
              >
                <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase italic">Email</p>
                  <p className="text-[11px] font-bold text-slate-400 group-hover:text-blue-400 transition-colors tracking-tight">
                    greenbi0852@gmail.com
                  </p>
                </div>
              </a>
              <a
                href="tel:010-4784-3867"
                className="flex items-center gap-3 group cursor-pointer w-fit"
              >
                <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-600 uppercase italic">Phone</p>
                  <p className="text-[11px] font-bold text-slate-400 group-hover:text-blue-400 transition-colors tracking-tight">
                    010-4784-3867
                  </p>
                </div>
              </a>
            </div>
            {/* 유튜브 + 깃헙 묶음 */}
            <div className="flex flex-col md:flex-col gap-4">
              <a
                href="https://www.youtube.com/@SUB_FC"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 w-fit"
              >
                <Youtube
                  size={18}
                  className="text-slate-400 group-hover:text-red-500 transition-colors"
                />
                <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest">
                  YouTube
                </span>
                <ExternalLink
                  size={10}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                href="https://github.com/seong5"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-300 w-fit"
              >
                <Github
                  size={18}
                  className="text-slate-400 group-hover:text-blue-400 transition-colors"
                />
                <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-400 uppercase tracking-widest">
                  @seong5
                </span>
                <ExternalLink
                  size={10}
                  className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">
            © SINCE 2019. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  )
}
