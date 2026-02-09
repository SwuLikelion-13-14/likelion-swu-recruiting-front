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

function TrackCard({ title, iconSrc, members, variant = 'half', className = '' }: TrackCardProps) {
  return (
    <div
      className={[
        styles.card,
        variant === 'full' ? styles.cardFull : styles.cardHalf,
        className, 
      ].join(' ')}
    >
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

export default function LeadersCardSection() {
  return (
    <div className={styles.wrap}>
      <div className={styles.topRow}>
        <TrackCard
          title="PM & Design Track"
          iconSrc={iconFigma}
          members={[
            { name: '김주아', major: '첨단미디어디자인학과 23' },
            { name: '신동현', major: '소프트웨어융합학과 22' },
          ]}
          variant="half"
          className={styles.cardFixed} // 왼쪽 470 고정
        />

        <TrackCard
          title="Frontend Track"
          iconSrc={iconGit}
          members={[
            { name: '김시원', major: '디지털미디어학과 22' },
            { name: '손예원', major: '디지털미디어학과 21' },
            { name: '정규은', major: '소프트웨어융합학과 22' },
          ]}
          variant="half"
          className={styles.cardGrow} // 오른쪽 남는 폭 전부 사용
        />
      </div>

      <TrackCard
        title="Backend Track"
        iconSrc={iconDb}
        members={[
          { name: '김민서', major: '소프트웨어융합학과 22', roleLabel: '대표' },
          { name: '우예빈', major: '소프트웨어융합학과 24' },
          { name: '이다겸', major: '디지털미디어학과 22' },
          { name: '임제영', major: '소프트웨어융합학과 22' },
        ]}
        variant="full"
      />
    </div>
  );
}
