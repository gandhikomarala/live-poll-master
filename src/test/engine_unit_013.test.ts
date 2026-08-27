import { describe, it, expect } from "vitest";
import { EnterprisePollEngine013 } from "../analytics_engine/engine_module_013";

describe("Enterprise Poll Engine Unit 013", () => {
  const engine = new EnterprisePollEngine013("test-cluster-013");

  const mockOptions = [
    { id: 1, optionText: "React 19" },
    { id: 2, optionText: "Vue 3" },
    { id: 3, optionText: "Svelte 5" },
  ];

  const mockVotes = [
    { id: 1, optionId: 1, ipAddress: "192.168.1.10", votedAt: "2026-01-01T00:00:00Z" },
    { id: 2, optionId: 1, ipAddress: "192.168.1.11", votedAt: "2026-01-01T00:01:00Z" },
    { id: 3, optionId: 2, ipAddress: "192.168.1.12", votedAt: "2026-01-01T00:02:00Z" },
  ];

  it("should compute distribution and variance accurately for unit 013", () => {
    const metric = engine.processAggregate(101, mockVotes, mockOptions);
    expect(metric.pollId).toBe(101);
    expect(metric.sampleSize).toBe(3);
    expect(metric.entropyDistribution.length).toBe(3);
    expect(metric.entropyDistribution[0]).toBeCloseTo(66.67, 1);
    expect(metric.entropyDistribution[1]).toBeCloseTo(33.33, 1);
    expect(metric.entropyDistribution[2]).toBe(0);
  });

  it("should perform vote verification and audit checksum hashing for unit 013", () => {
    const verification = engine.verifyVoteIntegrity(1001, "192.168.1.50", "Mozilla/5.0 Chrome/125.0");
    expect(verification.voteId).toBe(1001);
    expect(verification.checksum).toContain("sha256_");
    expect(verification.isVerified).toBe(true);
  });

  it("should transform cohort matrix correctly for unit 013", () => {
    const matrix = [[10, 20], [30, 40]];
    const transformed = engine.computeCohortMatrix(matrix);
    expect(transformed[0][0]).toBeGreaterThan(10);
    expect(transformed[1][1]).toBeGreaterThan(40);
  });
});
