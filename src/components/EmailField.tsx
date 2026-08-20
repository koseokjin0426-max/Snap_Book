"use client";

import { useState } from "react";
import { EMAIL_DOMAINS, EMAIL_DOMAIN_CUSTOM } from "@/lib/constants";
import SelectField from "./SelectField";

interface EmailFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}

const DOMAIN_OPTIONS = [
  ...EMAIL_DOMAINS.map((d) => ({ value: d, label: d })),
  { value: EMAIL_DOMAIN_CUSTOM, label: EMAIL_DOMAIN_CUSTOM },
];

function splitEmail(value: string): { local: string; domain: string } {
  const at = value.indexOf("@");
  if (at === -1) return { local: value, domain: "" };
  return { local: value.slice(0, at), domain: value.slice(at + 1) };
}

export default function EmailField({ id, value, onChange, ariaInvalid, ariaDescribedby }: EmailFieldProps) {
  const initial = splitEmail(value);
  const initialIsKnown = (EMAIL_DOMAINS as readonly string[]).includes(initial.domain);

  const [local, setLocal] = useState(initial.local);
  const [domainSelect, setDomainSelect] = useState(
    initial.domain === "" ? "" : initialIsKnown ? initial.domain : EMAIL_DOMAIN_CUSTOM
  );
  const [customDomain, setCustomDomain] = useState(
    initial.domain !== "" && !initialIsKnown ? initial.domain : ""
  );

  function emit(nextLocal: string, nextDomainSelect: string, nextCustomDomain: string) {
    const domain = nextDomainSelect === EMAIL_DOMAIN_CUSTOM ? nextCustomDomain : nextDomainSelect;
    onChange(nextLocal && domain ? `${nextLocal}@${domain}` : nextLocal);
  }

  function handleLocalChange(next: string) {
    setLocal(next);
    emit(next, domainSelect, customDomain);
  }

  function handleDomainSelectChange(next: string) {
    setDomainSelect(next);
    emit(local, next, customDomain);
  }

  function handleCustomDomainChange(next: string) {
    setCustomDomain(next);
    emit(local, domainSelect, next);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          inputMode="email"
          autoComplete="off"
          className="text-input min-w-0 flex-1"
          value={local}
          onChange={(e) => handleLocalChange(e.target.value)}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          placeholder="example"
        />
        <span className="shrink-0 text-sm font-medium text-ink-700/50">@</span>
        <SelectField
          value={domainSelect}
          onChange={handleDomainSelectChange}
          options={DOMAIN_OPTIONS}
          placeholder="도메인 선택"
          ariaLabel="이메일 도메인"
          className="flex-1"
        />
      </div>

      {domainSelect === EMAIL_DOMAIN_CUSTOM && (
        <input
          type="text"
          autoFocus
          autoComplete="off"
          value={customDomain}
          onChange={(e) => handleCustomDomainChange(e.target.value)}
          placeholder="예: company.co.kr"
          className="text-input mt-3"
          aria-label="이메일 도메인 직접 입력"
        />
      )}
    </div>
  );
}
