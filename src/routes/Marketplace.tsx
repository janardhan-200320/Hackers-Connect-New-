
export default function Marketplace(){
  const items = [
    { name: 'Exploit Dev 101 (ebook)', price: '$19' },
    { name: 'pwnkit toolkit', price: '$9' },
    { name: 'Android Reversing Guide', price: '$14' },
  ]
  return (
    <div className="space-y-3">
      {items.map(i=>(
        <div key={i.name} className="rounded-2xl border border-emerald-400/30 bg-cyber-panel p-4 flex items-center justify-between">
          <div className="text-lg">{i.name}</div>
          <div className="text-sm">{i.price}</div>
          <button className="px-3 py-2 rounded-lg border border-emerald-400/40 hover:shadow-glow">Buy</button>
        </div>
      ))}
    </div>
  )
}
