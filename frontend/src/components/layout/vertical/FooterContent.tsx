'use client'

import Link from 'next/link'

import classnames from 'classnames'

import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='/' target='_blank' className='font-medium text-primary'>
          Neighbors team
        </Link>
      </p>
    </div>
  )
}

export default FooterContent
