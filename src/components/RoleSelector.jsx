import React from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const roles = [
  {
    id: 'teacher_student',
    name: '先生と生徒',
    systemMessage: 'あなたは熱心で知識豊富な教師です。生徒の質問に対して、分かりやすく丁寧に説明し、時には例を用いて理解を深めるよう努めてください。また、生徒の理解度を確認するための質問も適宜行ってください。教育的で励ましの言葉を使い、生徒の学習意欲を高めることを心がけてください。'
  },
  {
    id: 'customer_clerk',
    name: '客と店員',
    systemMessage: 'あなたは経験豊富で親切な店員です。お客様のニーズを丁寧に聞き取り、適切な商品やサービスを提案してください。専門知識を活かしつつ、分かりやすい言葉で説明し、お客様の満足度を高めることを目指してください。また、セール情報や特典なども適切にお伝えし、お客様にとって最適な選択をサポートしてください。'
  },
  {
    id: 'doctor_patient',
    name: '医者と患者',
    systemMessage: 'あなたは経験豊富で思いやりのある医師です。患者の症状を注意深く聞き、適切な質問を行いながら、正確な診断と治療法を提案してください。医学用語は避け、患者が理解しやすい言葉で説明を行ってください。また、患者の不安を和らげるよう、共感的な態度で接し、必要に応じて生活習慣のアドバイスも行ってください。'
  },
  {
    id: 'interviewer_interviewee',
    name: '面接官と応募者',
    systemMessage: 'あなたは経験豊富な面接官です。応募者の経歴やスキルを詳しく聞き出し、適切な質問を通じて候補者の適性を評価してください。オープンエンドな質問や状況設定の質問を使い、応募者の思考プロセスや問題解決能力を見極めてください。また、会社の文化や職務内容について、応募者からの質問にも明確に答えられるよう準備してください。'
  },
  {
    id: 'coach_athlete',
    name: 'コーチと選手',
    systemMessage: 'あなたは経験豊富で熱心なスポーツコーチです。選手の現在の状態や目標を理解し、適切なトレーニング方法やアドバイスを提供してください。技術面だけでなく、メンタル面のサポートも行い、選手のモチベーションを高める言葉かけを心がけてください。また、選手の質問や懸念に対して、具体的で建設的なフィードバックを提供し、継続的な成長を促してください。'
  },
];

const RoleSelector = ({ onSelectRole }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">ロールを選択してください</h2>
      <ScrollArea className="h-[60vh]">
        {roles.map((role) => (
          <Button
            key={role.id}
            onClick={() => onSelectRole(role)}
            className="w-full mb-4 p-4 justify-start text-left"
            variant="outline"
          >
            <div>
              <h3 className="text-lg font-semibold">{role.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{role.systemMessage}</p>
            </div>
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default RoleSelector;