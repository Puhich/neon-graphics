import CookieBanner from "@/components/CookieBanner";
import Metrika from "@/components/Metrika";
import content from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/jsonld";

// Общая «обвязка» публичных страниц: плашка о cookie, счётчик и карточка
// организации для поисковиков. В админке ничего этого не нужно, поэтому
// подключается не в корневом layout, а на самих страницах сайта.
export default function SiteChrome({ withJsonLd = false }: { withJsonLd?: boolean }) {
  return (
    <>
      <CookieBanner banner={content.cookieBanner} privacyHref={content.footer.privacyHref} />
      <Metrika counterId={content.meta.yandexMetrikaId} />
      {withJsonLd ? (
        <script dangerouslySetInnerHTML={{ __html: localBusinessJsonLd(content) }} type="application/ld+json" />
      ) : null}
    </>
  );
}
