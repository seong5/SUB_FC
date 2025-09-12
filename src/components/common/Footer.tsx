import Link from 'next/link'
import Icon from './Icon'

export default function Footer() {
  return (
    <footer className="flex flex-row gap-5 mt-10 md:gap-20 text-gray-500 bg-white border-t border-gray-300 text-12 md:text-16 justify-evenly p-5 botton-0">
      <Link href="https://www.youtube.com/@SUB_FC" target="_blank" rel="noopener noreferrer">
        <div className="flex flex-row gap-8 text-10 md:text-16">
          <Icon icon="Youtube" className="w-20 h-20" />
          SUB FC
        </div>
      </Link>
      <Link href="https://github.com/seong5" target="_blank" rel="noopener noreferrer">
        @seong5
      </Link>
      <div className="text-10 md:text-16">
        <p>greenbi0852@gmail.com</p>
        <p>010-4784-3867</p>
      </div>
    </footer>
  )
}
