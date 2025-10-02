
import StoryBar from '@/components/StoryBar'
import PostComposer from '@/components/PostComposer'
import PostCard from '@/components/PostCard'

export default function Feed(){
  const posts = [
    { id: 1, author: '0xRaven', content: 'New RCE chain on XYZ v2.1 – details in gist.'},
    { id: 2, author: 'CryptoCat', content: 'Breaking down lattice cryptanalysis basics.'},
    { id: 3, author: 'RootNova', content: 'From recon to pwn: a quick checklist.'},
  ]
  return (
    <div className="space-y-3">
      <StoryBar />
      <PostComposer />
      {posts.map(p=>(<PostCard key={p.id} author={p.author} content={p.content}/>))}
    </div>
  )
}
