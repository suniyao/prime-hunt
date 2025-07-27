import { Heart } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import Link from "next/link"
export default function InfoBlock() {
  return (
    <div className="text-white flex flex-row gap-5 font-bold">
      <div className="flex flex-row gap-1 items-center">
        a daily game made with <Heart size={20} fill="#FFF"/> for 
        <div className="underline decoration-dotted hover:decoration-wavy">
          <Link href={"https://toybox.hackclub.com/"}>Toybox</Link> 
        </div>
      </div>
      <div>
        <Link href={"https://github.com/suniyao/prime-hunt"}>
          <FaGithub size={30} />
        </Link>
      </div>
    </div>
  )
}