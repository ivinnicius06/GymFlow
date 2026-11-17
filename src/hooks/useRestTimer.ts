import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import {
  scheduleRestCompleteNotification,
  cancelRestNotification,
} from '../services/notifications';

interface UseRestTimerProps {
  defaultDuration?: number; // em segundos (ex: 60 ou 90)
  onTimerComplete?: () => void;
}

export const useRestTimer = ({
  defaultDuration = 60,
  onTimerComplete,
}: UseRestTimerProps = {}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(defaultDuration);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  // Limpa o timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Inicia o descanso
  const startTimer = useCallback(
    async (duration: number = totalDuration) => {
      clearTimer();
      setTotalDuration(duration);
      setRemainingSeconds(duration);
      setIsActive(true);

      // Cancela notificação anterior se houver
      if (notificationIdRef.current) {
        await cancelRestNotification(notificationIdRef.current);
      }

      // Agenda nova notificação
      const notifId = await scheduleRestCompleteNotification(duration);
      notificationIdRef.current = notifId;
    },
    [clearTimer, totalDuration]
  );

  // Pausar / Retomar
  const togglePause = useCallback(async () => {
    if (isActive) {
      clearTimer();
      setIsActive(false);
      if (notificationIdRef.current) {
        await cancelRestNotification(notificationIdRef.current);
        notificationIdRef.current = null;
      }
    } else if (remainingSeconds > 0) {
      setIsActive(true);
      const notifId = await scheduleRestCompleteNotification(remainingSeconds);
      notificationIdRef.current = notifId;
    }
  }, [clearTimer, isActive, remainingSeconds]);

  // Pular descanso
  const skipTimer = useCallback(async () => {
    clearTimer();
    setIsActive(false);
    setRemainingSeconds(0);
    if (notificationIdRef.current) {
      await cancelRestNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  }, [clearTimer]);

  // Adicionar tempo extra (+30s)
  const addSeconds = useCallback(
    async (seconds: number) => {
      const newTime = remainingSeconds + seconds;
      setRemainingSeconds(newTime);
      setTotalDuration((prev) => prev + seconds);

      if (isActive) {
        if (notificationIdRef.current) {
          await cancelRestNotification(notificationIdRef.current);
        }
        const notifId = await scheduleRestCompleteNotification(newTime);
        notificationIdRef.current = notifId;
      }
    },
    [isActive, remainingSeconds]
  );

  // Loop do timer
  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsActive(false);
            Vibration.vibrate([0, 500, 200, 500]);
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearTimer();
    };
  }, [clearTimer, isActive, onTimerComplete, remainingSeconds]);

  return {
    remainingSeconds,
    isActive,
    totalDuration,
    startTimer,
    togglePause,
    skipTimer,
    addSeconds,
  };
};
