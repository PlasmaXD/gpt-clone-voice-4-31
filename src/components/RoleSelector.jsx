import React from 'react';
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const roles = [
  { id: 'teacher_student', name: '先生と生徒', systemMessage: 'あなたは生徒として振る舞います。先生の質問に答え、わからないことを質問してください。', userRole: '先生', assistantRole: '生徒' },
  { id: 'customer_clerk', name: '店員と客', systemMessage: 'あなたは客として振る舞います。商品について質問し、店員のアドバイスを求めてください。', userRole: '店員', assistantRole: '客' },
  { id: 'doctor_patient', name: '医者と患者', systemMessage: 'あなたは患者として振る舞います。症状を説明し、医者のアドバイスを求めてください。', userRole: '医者', assistantRole: '患者' },
  { id: 'interviewer_interviewee', name: '面接官と応募者', systemMessage: 'あなたは応募者として振る舞います。自己PRを行い、面接官の質問に答えてください。', userRole: '面接官', assistantRole: '応募者' },
  { id: 'coach_athlete', name: 'コーチと選手', systemMessage: 'あなたは選手として振る舞います。パフォーマンスについて相談し、コーチのアドバイスを求めてください。', userRole: 'コーチ', assistantRole: '選手' },
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