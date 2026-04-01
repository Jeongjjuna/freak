'use client';

import { useEffect } from 'react';

interface Props {
  html: string;
}

export default function PostContent({ html }: Props) {
  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>('.prose pre');
    pres.forEach((pre) => {
      if (!pre.querySelector('.lang-label')) {
        const code = pre.querySelector('code[data-language]');
        const lang = code?.getAttribute('data-language');
        if (lang) {
          const label = document.createElement('span');
          label.className = 'lang-label';
          label.textContent = lang;
          pre.prepend(label);
        }
      }

      if (pre.querySelector('.copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'copy-btn';
      button.textContent = '복사';

      button.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code?.innerText ?? '';
        navigator.clipboard.writeText(text).then(() => {
          button.textContent = '✓';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = '복사';
            button.classList.remove('copied');
          }, 1500);
        });
      });

      pre.appendChild(button);
    });
  }, [html]);

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
