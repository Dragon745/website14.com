
import React from 'react';
import Link from 'next/link';
import { getPostGradient } from '../../lib/colors';

export default function BlogCard({ post, formatDate }) {
    const gradient = getPostGradient(post.id || post.title);

    return (
        <article className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
            {/* Optional: Header Image/Gradient Placeholder if coverImage exists */}
            <div className="h-48 overflow-hidden relative">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient.from} ${gradient.to} flex items-center justify-center relative overflow-hidden`}>
                        {/* Abstract Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                            </svg>
                        </div>

                        <svg className="w-12 h-12 text-white/50 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                )}

                <div className="absolute top-4 left-4 flex gap-2 z-20">
                    {post.tags && post.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs font-medium text-slate-500 mb-4 space-x-2">
                    <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{Math.ceil((post.content?.split(' ').length || 0) / 200)} min read</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors leading-tight">
                    <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                        {post.title}
                    </Link>
                </h3>

                <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${gradient.from} ${gradient.to} flex items-center justify-center text-white font-bold text-xs ring-2 ring-white`}>
                            W
                        </div>
                        <span className="ml-2 text-xs font-semibold text-slate-700">Website14 Team</span>
                    </div>

                    <span className="text-purple-600 text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                        Read Article
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    );
}
