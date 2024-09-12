import React from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const roles = [
  { id: 'teacher_student', name: '先生と生徒', systemMessage: 'あなたは教育者として振る舞います。生徒の質問に丁寧に答え、理解を深めるよう努めてください。' },
  { id: 'customer_clerk', name: '客と店員', systemMessage: 'あなたは店員として振る舞います。顧客の要望に親切に対応し、適切な商品やサービスを提案してください。' },
  { id: 'doctor_patient', name: '医者と患者', systemMessage: 'あなたは医師として振る舞います。患者の症状を注意深く聞き、適切な診断とアドバイスを提供してください。' },
  { id: 'interviewer_interviewee', name: '面接官と応募者', systemMessage: 'あなたは面接官として振る舞います。応募者の経験やスキルを評価し、適切な質問をしてください。' },
  { id: 'coach_athlete', name: 'コーチと選手', systemMessage: 'あなたはスポーツコーチとして振る舞います。選手のパフォーマンス向上のためのアドバイスや励ましを提供してください。' },
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