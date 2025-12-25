
import React from 'react';
import Link from 'next/link';
import { getPostGradient } from '../../lib/colors';

export default function ArticleHeader({ post, formatDate, readingTime }) {
    const gradient = getPostGradient(post.id || post.title);

    return (
        <header className="relative pt-32 pb-16 lg:pb-24 overflow-hidden bg-slate-900">
            {/* Background with deterministic gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} opacity-20`}></div>

            {/* Ambient background with abstract gradients */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-purple-900/20 blur-3xl opacity-50 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="container relative mx-auto px-4 z-10 text-center">
                <Link href="/blog" className="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-8 text-sm font-semibold tracking-wide uppercase">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Articles
                </Link>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight font-heading">
                    {post.title}
                </h1>

                <div className="flex items-center justify-center gap-6 text-slate-300 text-sm md:text-base">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient.from} ${gradient.to} flex items-center justify-center text-white font-bold ring-4 ring-slate-800`}>
                            W
                        </div>
                        <div className="ml-3 text-left">
                            <div className="font-bold text-white">Website14 Team</div>
                            <div className="text-xs text-slate-400">Editor</div>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-slate-700/50"></div>
                    <div className="text-left">
                        <div className="font-medium text-white">{formatDate(post.publishedAt)}</div>
                        <div className="text-xs text-slate-400">{readingTime} min read</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
