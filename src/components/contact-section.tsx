import { MailIcon, PhoneIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { ContactForm } from '@/components/contact-form';
import { cn } from '@/lib/utils';

interface ContactInfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

const ContactInfo = (props: ContactInfoProps) => {
  return (
    <div className={cn('flex items-center gap-3 py-3', props.className)}>
      <div className="rounded-lg border bg-card p-3 shadow-xs [&_svg]:size-5">
        {props.icon}
      </div>
      <div>
        <p className="font-medium">{props.label}</p>
        <p className="text-xs text-muted-foreground">{props.value}</p>
      </div>
    </div>
  );
};

export const ContactSection = async () => {
  const t = await getTranslations('Contact');

  const contactInfo = [
    {
      icon: <MailIcon />,
      label: t('email_label'),
      value: t('email_value'),
    },
    {
      icon: <PhoneIcon />,
      label: t('phone_label'),
      value: t('phone_value'),
    },
  ];

  return (
    <div className="relative grid h-full w-full border md:grid-cols-2">
      <div className="col-span-1 flex flex-col space-y-4 p-8">
        <h1 className="text-2xl font-medium tracking-wide md:text-3xl">
          {t('heading')}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {t('description')}
        </p>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
          {t('response_time')}
        </p>
        <div className="grid gap-4">
          {contactInfo.map((info) => (
            <ContactInfo key={info.label} {...info} />
          ))}
        </div>
      </div>
      <div className="col-span-1 flex items-center border-t p-8 md:border-t-0 md:border-l">
        <ContactForm />
      </div>
    </div>
  );
};
