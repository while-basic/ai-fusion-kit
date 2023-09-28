import { badgeVariants } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Copy, RefreshCcw, StopCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar';
import { Message } from '@/lib/db';

type ChatBubbleProps = {
    id: Message['id']
    prevId?: Message['id'];
    direction?: 'start' | 'end';
    avatar?: string;
    name: string;
    time?: string;
    status?: string;
		content: string;
    isLoading: boolean;
    isLast: boolean;
    onCopy: (message: string) => void;
    onRegenerate: (id: Message['id']) => void;
    onStopGenerating?: () => void;
}

export const ChatBubble = ({
  prevId,
  content,
  name,
  avatar,
  direction,
  status,
  time,
  isLoading,
  isLast,
  onCopy,
  onRegenerate,
  onStopGenerating
}: ChatBubbleProps) => {
  const chatClass = cn(`chat-${direction} chat mb-4`, {
    'place-items-start grid-cols-[auto_1fr]': direction === 'start',
    'place-items-end grid-cols-[1fr_auto]': direction === 'end',
  })
  const chatBubbleClass = cn('chat-bubble min-h-fit max-w-full rounded-md px-4 py-2 lg:max-w-[90%]', {
    'bg-secondary': direction === 'start',
    'bg-primary text-primary-foreground': direction === 'end',
  })

  const handleOnCopy = () => {
    onCopy(content)
  }

  const renderActionButtons = () => {
    const copyButton = (
      <button className={badgeVariants({ variant: "secondary" })} onClick={handleOnCopy}>
        <Copy size={12} className='mr-1'/>
        Copy
      </button>
    )
    if (isLast) {
      return isLoading ? (
        direction === "start" && <button className={badgeVariants({ variant: "secondary" })} onClick={onStopGenerating}>
          <StopCircle size={12} className='mr-1'/>
          Stop generating
        </button>
      ) : (
        <>
          {copyButton}
          {direction === "start" && <button className={badgeVariants({ variant: "secondary", className: 'ml-2' })} onClick={() => prevId && onRegenerate(prevId)}>
            <RefreshCcw size={12} className='mr-1'/>
            Regenerate response
          </button>}
        </>
      )
    }

    return copyButton
  }

  return (
    <div className={chatClass}>
      {
        avatar ? (
          <div className="avatar chat-image">
            <div className="w-10 rounded-full">
              <Image src={avatar} alt='avatar' width={40} height={40}/>
            </div>
          </div>
        ) : (
          <div className="avatar chat-image">
            <Avatar className='w-10'>
              <AvatarImage src=''/>
              <AvatarFallback>VN</AvatarFallback>
            </Avatar>
          </div>
        )
      }
      <div className="chat-header mb-2 text-muted-foreground">
        {name}
        { time ? <time className="text-xs opacity-50">{time}</time> : null }
      </div>
      <div className={chatBubbleClass}>
        {content || '...'}
      </div>
      <div className="chat-footer">
        {status}
        <div className='mt-2 flex w-full justify-end'>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  )
}