import Link from "next/link";

interface Breadcrumb {
  name: string;
  url?: string;
}

interface PageTitleBannerProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageTitleBanner({
  title,
  breadcrumbs = [],
}: PageTitleBannerProps) {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-poller uppercase tracking-wider">{title}</h1>

        {breadcrumbs.length > 0 && (
          <nav className="text-sm text-gray-400 mt-2 flex justify-center items-center space-x-2">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={idx} className="flex items-center space-x-2">
                  {crumb.url && crumb.url !== "#" ? (
                    <Link
                      href={crumb.url}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-white font-semibold">{crumb.name}</span>
                  )}
                  {!isLast && <span>/</span>}
                </div>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}
