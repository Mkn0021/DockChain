export default async function Dashboard() {
  const items = [
    { title: 'Templates', value: 12 },
    { title: 'Documents', value: 28 },
    { title: 'Status', value: "Connected" },
  ];

  return (
    <div className="grid grid-cols-3 w-full border border-border">
      {items.map((item, index) => (
        <div key={item.title} className="flex items-center">
          {/* Add separator on left side of middle item */}
          {index === 1 && (
            <div className="w-px h-full bg-border"></div>
          )}
          <div className="flex-1 gap-6 px-6 py-6 md:py-10 md:px-12 xl:px-16">
            <h4 className="text-xs md:text-base m-0 p-0">{item.title}</h4>
            <p className="text-lg md:text-2xl xl:text-3xl text-text-feature">{item.value}</p>
          </div>
          {/* Add separator on right side of middle item */}
          {index === 1 && (
            <div className="w-px h-full bg-border"></div>
          )}
        </div>
      ))}
    </div>
  );
}
