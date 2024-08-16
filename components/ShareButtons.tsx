import {ReactElement} from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookShareCount,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share'
import {DestructuredProperty} from '@/utilities/interfaces'
const ShareButtons: React.FC<DestructuredProperty> = (
  {property}: DestructuredProperty
): ReactElement => {
  const url: string = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`
  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share
      </h3>
      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton
          url={url}
          title={property.name}
          hashtag={`${property.type.replace(/\s/g, '')}ForRent`}
        >
          <FacebookIcon
            size={40}
            round={true}
          >
            <FacebookShareCount url={url}/>
          </FacebookIcon>
        </FacebookShareButton>
        <FacebookMessengerShareButton
          url={url}
          title={property.name}
          appId={process.env.FACEBOOK_MESSENGER_APP_ID ?? ''}
        >
          <FacebookMessengerIcon
            size={40}
            round={true}
          />
        </FacebookMessengerShareButton>
        <WhatsappShareButton
          url={url}
          title={property.name}
          separator=':: '
        >
          <WhatsappIcon
            size={40}
            round={true}
          />
        </WhatsappShareButton>
        <TwitterShareButton
          url={url}
          title={property.name}
          hashtags={[`${property.type.replace(/\s/g, '')}ForRent`]}
        >
          <XIcon
            size={40}
            round={true}
          />
        </TwitterShareButton>
        <EmailShareButton
          url={url}
          subject={`${property.name} for rent`}
          body={`I thought you might be interested in thsi rental ad:\n${url}`}
        >
          <EmailIcon
            size={40}
            round={true}
          />
        </EmailShareButton>
      </div>
    </>
  )
}
export default ShareButtons