import { useState } from 'react'

import { Skeleton } from '@mui/material'

import { BACKEND_API } from '../../utils/request'

type UserAvatarProps = {
  image?: string | null
  className?: string
  alt?: string
  defaultImage?: string
}

const DEFAULT_AVATAR = '/images/avatars/profile-image.png'

const UserAvatar = ({
  image,
  className = 'bs-[146px] w-full object-contain',
  alt = 'User avatar',
  defaultImage = DEFAULT_AVATAR
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const imageSrc = image && !imageError ? BACKEND_API + image : defaultImage

  return (
    <div className='relative'>
      {imageLoading && image && !imageError && (
        <Skeleton variant='rectangular' className={className} animation='wave' />
      )}

      <img
        loading='eager'
        src={imageSrc}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading && image && !imageError ? 'none' : 'block' }}
      />
    </div>
  )
}

export default UserAvatar
