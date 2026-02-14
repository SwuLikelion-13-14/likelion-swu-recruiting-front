import styles from './LeadersCardSection.module.css';
import iconFigma from '../../assets/icon/tool_figma.svg';
import iconGit from '../../assets/icon/tool_git.svg';
import iconDb from '../../assets/icon/tool_database.svg';

type Member = {
  name: string;
  major: string;
  roleLabel?: string;
  imageUrl?: string;
};

type TrackCardProps = {
  title: string;
  iconSrc: string;
  members: Member[];
  variant?: 'half' | 'full';
  className?: string;
};

type LeaderDto = {
  name: string;
  major: string;
  position?: string;
  profile?: string;
};

type TrackDto = {
  track: string;
  leaders: LeaderDto[];
};

type LeadersCardSectionProps = {
  tracks?: TrackDto[] | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/?$/, '/');

function resolveProfileUrl(profile?: string) {
  if (!profile) return undefined;
  if (/^https?:\/\//i.test(profile)) return profile;
  if (!API_BASE_URL) return profile;

  const path = profile.startsWith('/') ? profile.slice(1) : profile;
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return profile;
  }
}

// 대표만 뱃지 표시
function normalizeRoleLabel(position?: string) {
  const p = (position || '').trim();
  return p === '대표' ? '대표' : undefined;
}

function mapTrackToMembers(track: TrackDto): Member[] {
  return (track.leaders || []).map((l) => ({
    name: l.name,
    major: l.major,
    roleLabel: normalizeRoleLabel(l.position),
    imageUrl: resolveProfileUrl(l.profile),
  }));
}

// 트랙명
type TrackKind = 'PM_DESIGN' | 'FRONTEND' | 'BACKEND' | null;

function classifyTrack(trackName?: string): TrackKind {
  const t = (trackName || '').toLowerCase();

  if (t.includes('front') || t.includes('프론트')) return 'FRONTEND';
  if (t.includes('back') || t.includes('백') || t.includes('server')) return 'BACKEND';
  if (t.includes('pm') || t.includes('design') || t.includes('기획') || t.includes('디자인'))
    return 'PM_DESIGN';

  return null;
}

// API 실패/누락 대비 fallback 
const FALLBACK_PM: Member[] = [
  { name: '김주아', major: '첨단미디어디자인학과 23' },
  { name: '신동현', major: '소프트웨어융합학과 22' },
];

const FALLBACK_FE: Member[] = [
  { name: '김시원', major: '디지털미디어학과 22' },
  { name: '손예원', major: '디지털미디어학과 21' },
  { name: '정규은', major: '소프트웨어융합학과 22' },
];

const FALLBACK_BE: Member[] = [
  { name: '김민서', major: '소프트웨어융합학과 22', roleLabel: '대표' },
  { name: '우예빈', major: '소프트웨어융합학과 24' },
  { name: '이다겸', major: '디지털미디어학과 22' },
  { name: '임제영', major: '소프트웨어융합학과 22' },
];

function MemberItem({ member }: { member: Member }) {
  return (
    <div className={styles.member}>
      <div className={styles.avatar} aria-label={`${member.name} 이미지 영역`}>
        {member.imageUrl ? (
          <img className={styles.avatarImg} src={member.imageUrl} alt={member.name} />
        ) : (
          <div className={styles.avatarPlaceholder} />
        )}
      </div>

      <div className={styles.memberText}>
        <div className={styles.nameRow}>
          {member.roleLabel ? (
            <span className={styles.rolePill}>
              <span className="text-semibold-16 text-gray-white">{member.roleLabel}</span>
            </span>
          ) : null}
          <span className="text-semibold-20 text-gray-white">{member.name}</span>
        </div>
        <div className="text-medium-20 text-gray-40">{member.major}</div>
      </div>
    </div>
  );
}

/** 스켈레톤 UI */
function TrackCardSkeleton({ variant }: { variant: 'half' | 'full' }) {
  const count = variant === 'full' ? 4 : 2;

  return (
    <div className={styles.skelWrap} aria-hidden="true">
      <div className={styles.skelHeader}>
        <div className={styles.skelDot} />
        <div className={styles.skelHeaderLine} />
      </div>

      <div className={variant === 'full' ? styles.skelMembersFull : styles.skelMembersHalf}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={styles.skelMember}>
            <div className={styles.skelAvatar} />
            <div className={styles.skelLineSm} />
            <div className={styles.skelLineLg} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackCard({ title, iconSrc, members, variant = 'half', className = '' }: TrackCardProps) {
  return (
    <div className={[styles.card, variant === 'full' ? styles.cardFull : '', className].join(' ')}>
      <div className={styles.trackBadge}>
        <img className={styles.trackIcon} src={iconSrc} alt="" aria-hidden="true" />
        <span className="text-medium-20 text-gray-white">{title}</span>
      </div>

      <div className={variant === 'full' ? styles.memberRowCenter : styles.memberRow}>
        {members.map((m) => (
          <MemberItem key={`${title}-${m.name}`} member={m} />
        ))}
      </div>
    </div>
  );
}

export default function LeadersCardSection({ tracks }: LeadersCardSectionProps) {
  // 데이터 없으면 스켈레톤만 렌더
  if (!tracks) {
    return (
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <div className={[styles.card, styles.cardFixed].join(' ')}>
            <TrackCardSkeleton variant="half" />
          </div>
          <div className={[styles.card, styles.cardGrow].join(' ')}>
            <TrackCardSkeleton variant="half" />
          </div>
        </div>

        <div className={[styles.card, styles.cardFull].join(' ')}>
          <TrackCardSkeleton variant="full" />
        </div>
      </div>
    );
  }

  const list = Array.isArray(tracks) ? tracks : [];

  const pmTrack = list.find((t) => classifyTrack(t.track) === 'PM_DESIGN');
  const feTrack = list.find((t) => classifyTrack(t.track) === 'FRONTEND');
  const beTrack = list.find((t) => classifyTrack(t.track) === 'BACKEND');

  const pmMembers = pmTrack ? mapTrackToMembers(pmTrack) : FALLBACK_PM;
  const feMembers = feTrack ? mapTrackToMembers(feTrack) : FALLBACK_FE;
  const beMembers = beTrack ? mapTrackToMembers(beTrack) : FALLBACK_BE;

  return (
    <div className={styles.wrap}>
      <div className={styles.topRow}>
        <TrackCard
          title="PM & Design Track"
          iconSrc={iconFigma}
          members={pmMembers}
          variant="half"
          className={styles.cardFixed}
        />

        <TrackCard
          title="Frontend Track"
          iconSrc={iconGit}
          members={feMembers}
          variant="half"
          className={styles.cardGrow}
        />
      </div>

      <TrackCard title="Backend Track" iconSrc={iconDb} members={beMembers} variant="full" />
    </div>
  );
}
