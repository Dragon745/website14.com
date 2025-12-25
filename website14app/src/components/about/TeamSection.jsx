
import { teamData } from '../../data/aboutData';

export default function TeamSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-heading">Meet The Team</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-body">The passionate minds behind Website14.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {teamData.map((member, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-purple-100 hover:shadow-xl transition-all duration-300 text-center group">
                            <div className={`w-32 h-32 mx-auto rounded-full mb-6 ${member.avatarColor} group-hover:scale-105 transition-transform duration-300 ring-4 ring-slate-50 group-hover:ring-purple-50`}></div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1 font-heading">{member.name}</h3>
                            <div className="text-purple-600 font-medium text-sm mb-4 uppercase tracking-wide font-body">{member.role}</div>

                            <p className="text-slate-600 font-body leading-relaxed text-sm">
                                {member.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
