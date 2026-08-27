import { describe, it, expect } from "vitest";
import { calculateResults, PollOption, Vote } from "../lib/supabase";

describe("Poll Calculations & Local Logic", () => {
  const mockOptions: PollOption[] = [
    { id: 1, poll_id: 1, option_text: "Option A", created_at: "2026-01-01" },
    { id: 2, poll_id: 1, option_text: "Option B", created_at: "2026-01-01" },
    { id: 3, poll_id: 1, option_text: "Option C", created_at: "2026-01-01" },
  ];

  const mockVotes: Vote[] = [
    { id: 1, poll_id: 1, option_id: 1, user_id: "u1", ip_address: "192.168.1.1", voted_at: "2026-01-01", created_at: "2026-01-01" },
    { id: 2, poll_id: 1, option_id: 1, user_id: "u2", ip_address: "192.168.1.2", voted_at: "2026-01-01", created_at: "2026-01-01" },
    { id: 3, poll_id: 1, option_id: 2, user_id: "u3", ip_address: "192.168.1.3", voted_at: "2026-01-01", created_at: "2026-01-01" },
    { id: 4, poll_id: 1, option_id: 3, user_id: "u4", ip_address: "192.168.1.4", voted_at: "2026-01-01", created_at: "2026-01-01" },
  ];

  it("calculates accurate vote counts and percentages", () => {
    const results = calculateResults(mockOptions, mockVotes);
    
    expect(results).toHaveLength(3);
    
    const optA = results.find(r => r.optionId === 1);
    const optB = results.find(r => r.optionId === 2);
    const optC = results.find(r => r.optionId === 3);

    expect(optA?.voteCount).toBe(2);
    expect(optA?.percentage).toBe(50);

    expect(optB?.voteCount).toBe(1);
    expect(optB?.percentage).toBe(25);

    expect(optC?.voteCount).toBe(1);
    expect(optC?.percentage).toBe(25);
  });

  it("handles zero total votes without division by zero errors", () => {
    const results = calculateResults(mockOptions, []);
    expect(results).toHaveLength(3);
    results.forEach(r => {
      expect(r.voteCount).toBe(0);
      expect(r.percentage).toBe(0);
    });
  });
});
