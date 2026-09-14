import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import styles from "./home.module.css";

// Regional artwork can be replaced independently of the live festival posters.
const featuredRegion = {
  name: "강릉",
  title: "강릉 3일 살기",
  description: "바다와 커피, 그리고 느긋한 일상",
  image: "/images/regions/gangneung.webp"
};

export function RegionBanner() {
  return (
    <section
      className={styles.regionBanner}
      aria-label="추천 지역 강릉"
      style={{ backgroundImage: `url(${featuredRegion.image})` }}
    >
      <span className={styles.regionLabel}>
        <MapPin size={15} />
        {featuredRegion.name}
      </span>
      <div className={styles.bannerCopy}>
        <p className={styles.bannerKicker}>
          여행이 아닌,
          <br />
          이제는 살아보는 {featuredRegion.name}
        </p>
        <h2>{featuredRegion.title}</h2>
        <p className={styles.bannerDescription}>{featuredRegion.description}</p>
        <Link href="/plan/new" className={styles.bannerButton}>
          여행 일정 준비하기 <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
