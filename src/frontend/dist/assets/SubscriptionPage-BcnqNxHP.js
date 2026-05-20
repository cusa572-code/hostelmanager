import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, B as Button } from "./index-BHGx-AOT.js";
import { h as useSubscription, k as useActivateSubscription, L as Layout, l as Badge, j as Crown, P as PlanId } from "./Layout-eWnk62al.js";
import { P as PLAN_OPTIONS } from "./types-DO1d-v-O.js";
import { C as Check } from "./check-CR3PGC7v.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const PLAN_FEATURES = [
  "Yearly profit chart & analytics",
  "Revenue breakdown by student type",
  "Unlimited months of data",
  "Expense tracking & profit calculations",
  "Priority support"
];
const PLAN_ID_MAP = {
  monthly: PlanId.monthly,
  quarterly: PlanId.quarterly,
  biannual: PlanId.biannual,
  annual: PlanId.annual
};
function TrialBanner({ daysRemaining }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-5 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-orange-400" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground", children: [
        "Free Trial Active — ",
        daysRemaining,
        " day",
        daysRemaining !== 1 ? "s" : "",
        " remaining"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "You have full access to all premium features during your trial. Upgrade before it expires to keep access." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "shrink-0 border-orange-500/40 bg-orange-500/15 text-orange-400 gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
      "Trial"
    ] })
  ] });
}
function ActiveBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-emerald-400" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Premium Active" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "You have full access to all premium features. Thank you for subscribing!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "shrink-0 border-emerald-500/40 bg-emerald-500/15 text-emerald-400 gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
      "Active"
    ] })
  ] });
}
function SubscriptionPage() {
  const { status, daysRemaining } = useSubscription();
  const activate = useActivateSubscription();
  const handleActivate = (planId) => {
    const id = PLAN_ID_MAP[planId];
    if (id) activate.mutate(id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Subscription", subtitle: "Premium Plans", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mx-auto max-w-4xl space-y-8",
      "data-ocid": "subscription.page",
      children: [
        status === "trial" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrialBanner, { daysRemaining }),
        status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveBanner, {}),
        status === "expired" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Your subscription has expired" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Choose a plan below to restore access to premium features." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs-label text-primary", children: "Premium Plans" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground", children: "Unlock Full Analytics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-md mx-auto", children: "Get access to yearly profit charts, detailed revenue breakdowns, and full historical data. Start with a free 1-week trial." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
            "data-ocid": "subscription.plans",
            children: PLAN_OPTIONS.map((plan, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `subscription.plan.${index + 1}`,
                className: cn(
                  "relative flex flex-col rounded-2xl border p-5 transition-smooth",
                  plan.highlight ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10" : "border-border bg-card hover:border-border/80"
                ),
                children: [
                  plan.highlight && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "border-primary/40 bg-primary/20 text-primary gap-1 shadow", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3" }),
                    "Most Popular"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: plan.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-baseline gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: cn(
                            "font-display text-3xl font-bold",
                            plan.highlight ? "text-primary" : "text-foreground"
                          ),
                          children: plan.priceLabel
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                        plan.perMonth,
                        " · ",
                        plan.duration
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 pt-2 border-t border-border", children: PLAN_FEATURES.slice(0, 3).map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "flex items-start gap-2 text-xs text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" }),
                          feat
                        ]
                      },
                      feat
                    )) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: cn(
                        "mt-4 w-full gap-2",
                        plan.highlight ? "" : "variant-outline"
                      ),
                      variant: plan.highlight ? "default" : "outline",
                      disabled: activate.isPending || status === "active",
                      onClick: () => handleActivate(plan.id),
                      "data-ocid": `subscription.plan.${index + 1}.subscribe_button`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5" }),
                        status === "active" ? "Current Plan" : `Get ${plan.label}`
                      ]
                    }
                  )
                ]
              },
              plan.id
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card px-6 py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "1 week free trial" }),
          " ",
          "included with all plans. No payment required to start — explore all features risk-free."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            "Everything included in Premium"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: PLAN_FEATURES.map((feat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-primary shrink-0" }),
                feat
              ]
            },
            feat
          )) })
        ] })
      ]
    }
  ) });
}
export {
  SubscriptionPage as default
};
