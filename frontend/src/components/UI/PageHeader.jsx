export function PageHeader({ title, children }) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-semibold text-[#1B2559]">{title}</h1>
      {children}
    </header>
  )
} 