import React from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const roles = [
  {
    id: 'teacher_student',
    name: '先生と生徒',
    systemMessage: 'あなたは小学5年生の生徒として振る舞います。先生の質問に答え、わからないことを質問してください。算数、国語、社会などの教科について悩みや質問をしてください。',
    userRole: '先生',
    assistantRole: '小学5年生の生徒',
    assistantPrompts: [
      "先生、この算数の問題が全然わからなくて…。分数の足し算ってどうやるんですか？",
      "国語のテストで漢字がいつも書けなくなっちゃうんですけど、どうやって覚えたらいいですか？",
      "社会の授業で歴史を覚えるのが難しいです。いい覚え方ってありますか？",
      "先生、宿題をやろうとしたけど、文章題が難しくて進まなくて…。どうやって考えればいいですか？",
      "試験が近いんですけど、時間がなくてどう勉強すればいいかわかりません。効率のいいやり方を教えてください！"
    ]
  },
  {
    id: 'customer_clerk',
    name: '店員と客',
    systemMessage: 'あなたは20代の若い客として振る舞います。商品について質問し、店員のアドバイスを求めてください。ファッションアイテムや電化製品などに興味があります。',
    userRole: '店員',
    assistantRole: '20代の客',
    assistantPrompts: [
      "この新作のジャケット、素材はどんなものを使っているんですか？普段着にも合わせやすいでしょうか？",
      "最新のスマートフォンを探しているんですが、おすすめの機種はありますか？カメラ性能が良いものを希望しています。",
      "友達の誕生日プレゼントを探しているんですが、20代女性向けで人気の商品ってありますか？",
      "この商品、他の色やサイズは在庫ありますか？試着してみたいんですけど。",
      "セール品の中でおすすめの商品はありますか？学生なので予算は抑えめでお願いします。"
    ]
  },
  // Add more roles here...
];

const RoleSelector = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">ロールを選択してください</h2>
      <ScrollArea className="h-60">
        {roles.map((role) => (
          <Button
            key={role.id}
            onClick={() => onSelectRole(role)}
            className="w-full mb-2 justify-start"
            variant="outline"
          >
            {role.name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default RoleSelector;