import type { Package } from "../types/package";

/*const DESTINATION_IMAGES: Record<string, string> = {
    "Sigiriya": "https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};*/

export function PackageCard({ pkg }: Package) {
    //const displayImage = DESTINATION_IMAGES[pkg.destination_name] || "https://plus.unsplash.com/premium_photo-1675433766211-c8389398b37b?q=80&w=1223&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/*<div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-sky-700 shadow-sm">
                    {pkg.duration} Days
                </div>*/}
            </div>

            {/* Details */}
            <div className="p-5">
                {/*<p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">
                    {pkg.destination_name}
                </p>*/}
                <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-1">
                    {pkg.location}
                </p>
                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
                    {pkg.title}
                </h3>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-semibold">Starting from</p>
                        <p className="text-xl font-balck text-slate-900">Rs.{pkg.price}</p>
                    </div>
                    <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-sky-600 transiton-colors">→</button>
                </div>
            </div>
        </div>
    );
}