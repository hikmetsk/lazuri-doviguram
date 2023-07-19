import Head from "next/head";
import { ThemeMetaDTO } from "@/core/models/dtos/theme_meta_dto";
import { ThemeReposityImplementation } from "@/core/models/repositories/theme_repository_implementation";
import { LandingPageView } from "../features/landing_page_view";

export default function LandingPage({
  themeMetas,
}: {
  themeMetas: ThemeMetaDTO[];
}) {
  return (
    <>
      <Head>
        <title>Lazuri Doviguram</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <LandingPageView isAdmin={false} themeMetas={themeMetas} />
    </>
  );
}

export async function getStaticProps() {
  const themeRepository = ThemeReposityImplementation.getInstance();
  const themeMetas = await themeRepository.getThemeMetas();

  return {
    props: {
      themeMetas,
    },
  };
}
