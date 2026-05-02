 import { PackageCard } from "../components/PackageCard";

 const mockPackages = [
    {
        package_id: 1,
        title: "Ella Jungle Trek",
        location: "Badulla District, Uva Province",
        price: 12500,
        image: "https://images.unsplash.com/photo-1697811810067-4dcae11d3f77?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        package_id: 2,
        title: "Anuradhapura Sacred Heritage & Ancient City Tour",
        location: "Anuradhapura, North Central Province",
        price: 150000,
        image: "https://images.unsplash.com/photo-1653151106733-eadfaf201962?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
 ];

 export default function Sandbox() {
    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">UI Component Lab</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mockPackages.map((pkg) => (
                    <PackageCard key={pkg.package_id} pkg={pkg} />
                ))}
            </div>
        </div>
    );
 }