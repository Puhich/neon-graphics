# Редирект со старого адреса neon-graphics.vercel.app

Сайт жил на Vercel до 2026-09-17, Яндекс успел его проиндексировать. Этот проект
занимает тот же адрес и отвечает 301 на неон-графикс.рф, чтобы позиции перетекли
на новый домен, а не пропали. Ничего не собирает — только `vercel.json`.

Деплой (один раз, из этой папки):

    npx vercel login
    npx vercel --prod --name neon-graphics

Имя проекта должно быть ровно `neon-graphics`, чтобы получить адрес
neon-graphics.vercel.app. Проверка: `curl -sI https://neon-graphics.vercel.app/`
должен вернуть `301` и `location: https://xn----8sbigsmpbixo7a.xn--p1ai/`.
