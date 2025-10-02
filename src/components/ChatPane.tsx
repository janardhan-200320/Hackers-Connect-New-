
import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatPane(){
  const [msgs, setMsgs] = useState<string[]>(['Welcome to encrypted DMs (demo).'])
  const [text, setText] = useState('')

  const send = ()=>{
    if(!text.trim()) return
    // Demo "encryption": reverse string; replace with real crypto (WebCrypto) + server storage
    const encrypted = text.split('').reverse().join('')
    setMsgs(m=>[...m, 'you: '+encrypted])
    setText('')
  }

  return (
    <div className="h-[60vh] rounded-2xl border border-emerald-400/30 bg-cyber-panel flex flex-col">
      <div className="p-3 border-b border-emerald-400/20 text-sm">Encrypted DM</div>
      <div className="flex-1 overflow-auto p-3 space-y-2 text-sm">
        {msgs.map((m,i)=>(<div key={i} className="opacity-90">{m}</div>))}
      </div>
      <div className="p-3 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="flex-1 bg-transparent border border-emerald-400/30 rounded-lg px-3 py-2 outline-none"/>
        <button onClick={send} className="px-3 py-2 rounded-lg border border-emerald-400/40 hover:shadow-glow"><Send className="size-4"/></button>
      </div>
    </div>
  )
}
